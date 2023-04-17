import { App } from '@kasif/config/app';
import { environment } from '@kasif/util/environment';
import { User } from '@kasif/managers/auth';
import { backend } from '@kasif/config/backend';
import { Record } from 'pocketbase';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { BaseManager } from '@kasif/managers/base';
import { invoke } from '@tauri-apps/api';
import { PermissionType } from '@kasif/config/permission';
import { createVectorSlice } from '@kasif-apps/cinq';
import { KasifRemote } from '@kasif/util/remote';

export interface PluginModule {
  name: string;
  identifier: string;
  description?: string;
  lib: {
    dir: string;
    entry: string;
  };
  remote: {
    dir: string;
    entry: string;
  };
  path: string;
  permissions?: PermissionType[];
}

export interface PluginImport {
  file: {
    init: (app: App) => Promise<void>;
  };
  meta: PluginModule;
}

export interface PluginDTO {
  // author: User;
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
      // author: item.expand.author,
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
    const localDataDir = await environment.path.appLocalDataDir();
    const base = await environment.path.basename(pluginPath);
    const destination = await environment.path.join(localDataDir, 'apps', base);

    await environment.fs.copyFile(pluginPath, destination);
  }

  @trackable
  @authorized(['install_plugin'])
  async installPlugin(url: string) {
    const base = await environment.path.basename(url);
    const request = await fetch(url);
    const file = await request.blob();

    await environment.fs.writeBinaryFile(`apps/${base}`, await file.arrayBuffer(), {
      dir: environment.path.BaseDirectory.AppLocalData,
    });

    await invoke('load_plugins_remote');
  }

  async initSingleModule(name: string, isWebBased: boolean) {
    const manifest = await this.readManifest(name, isWebBased);
    const tokensFile = await environment.path.resolveResource('remote/stdout.json');
    const rawTokens = await environment.fs.readTextFile(tokensFile);
    const credentials = JSON.parse(rawTokens);

    const remoteProcess = new KasifRemote(
      credentials.tokens[manifest.identifier],
      credentials.port
    );
    // @ts-expect-error
    window[manifest.identifier] = {
      remote: remoteProcess,
    };
    const plugin = await this.importModule(manifest, isWebBased);

    if (plugin) {
      const instance = plugin.meta;

      this.app.notificationManager.log(
        `App '${instance.name}:${instance.identifier}' began loading`,
        'App loading'
      );

      try {
        const subapp = new App(this.app, {
          id: instance.identifier,
          name: instance.name,
          version: '0.0.1',
        });

        const currentPermissions =
          this.app.permissionManager.store.get()[instance.identifier] || [];
        const permissions = plugin.meta.permissions || [];
        this.app.permissionManager.store.setKey(
          plugin.meta.identifier,
          Array.from(new Set([...currentPermissions, ...permissions]))
        );

        try {
          await plugin.file.init(subapp);
          this.plugins.push(plugin);

          this.app.notificationManager.log(
            `App '${instance.name}:${instance.identifier}' loaded successfully`,
            'App loaded'
          );
        } catch (error) {
          this.app.notificationManager.error(
            String(error),
            `Error running '${instance.name}' (${instance.identifier}) plugin script`
          );
        }
      } catch (error) {
        this.app.notificationManager.error(String(error), 'Error getting tokens');
      }
    }
  }

  @trackable
  @authorized(['load_plugin'])
  async init() {
    if (environment.currentEnvironment === 'desktop') {
      const appsFolder = await environment.path.resolveResource('apps/');
      const entries = await environment.fs.readDir(appsFolder);

      for await (const entry of entries) {
        if (entry.name) {
          await this.initSingleModule(entry.name, false);
        }
      }
    } else {
      const entries: string[] = [];

      for await (const entry of entries) {
        await this.initSingleModule(entry, true);
      }
    }
  }

  @trackable
  @authorized(['load_plugin'])
  async importModule(
    pluginModule: PluginModule,
    isWebBased: boolean
  ): Promise<PluginImport | undefined> {
    let path: string;

    if (isWebBased) {
      path = `${import.meta.env.VITE_REACT_API_URL}/public/${pluginModule.path}/${
        pluginModule.lib.entry
      }`;
    } else {
      const appsFolder = await environment.path.resolveResource('apps/');
      path = await environment.path.join(appsFolder, pluginModule.path, pluginModule.lib.entry);
    }

    try {
      const file = (await import(`${path}.js`)) as {
        init: (app: App) => Promise<void>;
      };

      return { file, meta: pluginModule };
    } catch (error) {
      this.app.notificationManager.error(
        `Could not load app '${pluginModule.name}'. Check the logs for more information.`,
        'Error Loading App'
      );
      this.app.notificationManager.log(
        String((error as any).stack),
        `Loading '${pluginModule.name}' (${pluginModule.identifier}) app failed`
      );
    }
  }

  @trackable
  @authorized(['load_plugin'])
  async readManifest(path: string, isWebBased: boolean): Promise<PluginModule> {
    let manifest: any;

    if (isWebBased) {
      const request = await fetch(
        `${import.meta.env.VITE_REACT_API_URL}/public/${path}/package.json`
      );
      manifest = await request.json();
    } else {
      const appsFolder = await environment.path.resolveResource('apps/');

      const raw_manifest = await environment.fs.readTextFile(`${appsFolder}/${path}/package.json`, {
        dir: environment.path.BaseDirectory.Document,
      });
      manifest = JSON.parse(raw_manifest);
    }

    manifest.kasif.path = path;

    return manifest.kasif as PluginModule;
  }
}
