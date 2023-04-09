import { App } from '@kasif/config/app';
import { tauri } from '@kasif/util/tauri';
import {
  resolveResource,
  appLocalDataDir,
  join,
  basename,
  BaseDirectory,
} from '@tauri-apps/api/path';
import { User } from '@kasif/managers/auth';
import { backend } from '@kasif/config/backend';
import { Record } from 'pocketbase';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { BaseManager } from '@kasif/managers/base';
import { invoke } from '@tauri-apps/api';
import { PermissionType } from '@kasif/config/permission';
import { createVectorSlice } from '@kasif-apps/cinq';

export interface PluginModule {
  name: string;
  id: string;
  description?: string;
  entry: string;
  path: string;
  permissions?: PermissionType[];
}

export interface PluginImport {
  file: {
    init: (app: App) => void;
  };
  meta: PluginModule;
}

export interface PluginDTO {
  author: User;
  created: Date;
  category: string[];
  description: string;
  image: string;
  id: string;
  package: string;
  title: string;
  updated: Date;
  record: Record;
  downloads: number;
}

export interface PluginRawDTO {
  author: string;
  created: string;
  category: string[];
  description: string;
  image: string;
  id: string;
  package: string;
  title: string;
  updated: string;
  downloads: number;
  expand: {
    author: User;
  };
}

@tracker('pluginManager')
export class PluginManager extends BaseManager {
  plugins = createVectorSlice<PluginImport[]>([], { key: 'loaded-plugins' });

  #mapItem(item: PluginRawDTO, record: Record): PluginDTO {
    return {
      ...item,
      record,
      package: backend.getFileUrl(record, item.package),
      image: backend.getFileUrl(record, item.image),
      author: item.expand.author,
      created: new Date(item.created),
      updated: new Date(item.updated),
    };
  }

  @trackable
  async list(): Promise<PluginDTO[]> {
    const apps = await backend.collection('apps').getList(0, 100, { expand: 'author' });

    return apps.items.map((record) => {
      const item = record as unknown as PluginRawDTO;

      return this.#mapItem(item, record);
    });
  }

  @trackable
  async getPopular(): Promise<PluginDTO[]> {
    const apps = await backend
      .collection('apps')
      .getList(0, 2, { expand: 'author', sort: '-downloads' });

    return apps.items.map((record) => {
      const item = record as unknown as PluginRawDTO;

      return this.#mapItem(item, record);
    });
  }

  @trackable
  @authorized(['upload_plugin'])
  async uploadPlugin(pluginPath: string) {
    const localDataDir = await appLocalDataDir();
    const base = await basename(pluginPath);
    const destination = await join(localDataDir, 'apps', base);

    await tauri.fs.copyFile(pluginPath, destination);
    await invoke('load_plugins_remote');
    this.init();
  }

  @trackable
  @authorized(['install_plugin'])
  async installPlugin(url: string) {
    const base = await basename(url);
    const request = await fetch(url);
    const file = await request.blob();

    await tauri.fs.writeBinaryFile(`apps/${base}`, await file.arrayBuffer(), {
      dir: BaseDirectory.AppLocalData,
    });

    await invoke('load_plugins_remote');
    this.init();
  }

  @trackable
  @authorized(['load_plugin'])
  async init() {
    const appsFolder = await resolveResource('apps/');
    const entries = await tauri.fs.readDir(appsFolder);

    for (const entry of entries) {
      if (entry.name && entry.name.endsWith('.kasif')) {
        this.readManifest(entry.name).then(async (manifest) => {
          const plugin = await this.importModule(manifest);

          if (plugin) {
            const instance = plugin.meta;

            this.app.notificationManager.log(
              `App '${instance.name}:${instance.id}' began loading`,
              'App loading'
            );

            const subapp = new App(this.app, {
              id: instance.id,
              name: instance.name,
              version: '0.0.1',
            });

            const currentPermissions = this.app.permissionManager.store.get()[instance.id] || [];
            const permissions = plugin.meta.permissions || [];
            this.app.permissionManager.store.setKey(
              plugin.meta.id,
              Array.from(new Set([...currentPermissions, ...permissions]))
            );

            try {
              plugin.file.init(subapp);
              this.plugins.push(plugin);
            } catch (error) {
              this.app.notificationManager.error(
                String(error),
                `Error running '${instance.name}' (${instance.id}) plugin script`
              );
            }

            this.app.notificationManager.log(
              `App '${instance.name}:${instance.id}' loaded successfully`,
              'App loaded'
            );
          }
        });
      }
    }
  }

  @trackable
  @authorized(['load_plugin'])
  async importModule(pluginModule: PluginModule): Promise<PluginImport | undefined> {
    const appsFolder = await resolveResource('apps/');

    try {
      const file = (await import(
        `${appsFolder}/${pluginModule.path}/${pluginModule.entry}.js`
      )) as {
        init: (app: App) => void;
      };

      return { file, meta: pluginModule };
    } catch (error) {
      this.app.notificationManager.error(
        `Could not load app '${pluginModule.name}'. Check the logs for more information.`,
        'Error Loading App'
      );
      this.app.notificationManager.log(
        String((error as any).stack),
        `Loading '${pluginModule.name}' (${pluginModule.id}) app failed`
      );
    }
  }

  @trackable
  @authorized(['load_plugin'])
  async readManifest(path: string): Promise<PluginModule> {
    const appsFolder = await resolveResource('apps/');

    const raw_manifest = await tauri.fs.readTextFile(`${appsFolder}/${path}/package.json`, {
      dir: tauri.fs.BaseDirectory.Document,
    });

    const manifest = JSON.parse(raw_manifest);
    manifest.kasif.path = path;

    return manifest.kasif as PluginModule;
  }
}
