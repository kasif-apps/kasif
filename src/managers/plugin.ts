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
import { trackable, tracker } from '@kasif/util/misc';
import { BaseManager } from '@kasif/managers/base';

interface PluginModule {
  name: string;
  id: string;
  path: string;
}

interface PluginImport {
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
  async uploadPlugin(pluginPath: string) {
    const localDataDir = await appLocalDataDir();
    const base = await basename(pluginPath);
    const destination = await join(localDataDir, 'apps', base);

    await tauri.fs.copyFile(pluginPath, destination);
  }

  @trackable
  async installPlugin(url: string) {
    const base = await basename(url);
    const request = await fetch(url);
    const file = await request.blob();

    await tauri.fs.writeBinaryFile(`apps/${base}`, await file.arrayBuffer(), {
      dir: BaseDirectory.AppLocalData,
    });
  }

  @trackable
  async init() {
    const appsFolder = await resolveResource('apps/');
    const entries = await tauri.fs.readDir(appsFolder);

    const manifests: PluginModule[] = [];

    for await (const entry of entries) {
      if (entry.name && entry.name.endsWith('.kasif')) {
        manifests.push(await this.readManifest(entry.name));
      }
    }

    for await (const manifest of manifests) {
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
        plugin.file.init(subapp);

        this.app.notificationManager.log(
          `App '${instance.name}:${instance.id}' loaded successfully`,
          'App loaded'
        );
      }
    }
  }

  @trackable
  async importModule(pluginModule: PluginModule): Promise<PluginImport | undefined> {
    const appsFolder = await resolveResource('apps/');

    try {
      const file = (await import(`${appsFolder}/${pluginModule.path}/entry.js`)) as {
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
