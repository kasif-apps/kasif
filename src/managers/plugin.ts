import { App } from '@kasif/config/app';
import { backend } from '@kasif/config/backend';
import { PermissionType } from '@kasif/config/permission';
import { User } from '@kasif/managers/auth';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { environment } from '@kasif/util/environment';
import { KasifRemote } from '@kasif/util/remote';

import { createVectorSlice } from '@kasif-apps/cinq';
import { Record as PocketbaseRecord } from 'pocketbase';

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
  file: Record<string, <T>(...args: unknown[]) => Promise<T>> & {
    init: (app: App) => Promise<void>;
  };
  meta: PluginModule;
}

export interface PluginDTO {
  // author: User;
  app_id: string;
  created: Date;
  category: string[];
  description: string;
  image: string;
  id: string;
  package: string;
  title: string;
  updated: Date;
  record: PocketbaseRecord;
  downloads: number;
}

export interface PluginRawDTO {
  author: string;
  app_id: string;
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

  #mapItem(item: PluginRawDTO, record: PocketbaseRecord): PluginDTO {
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

    return apps.items.map(record => {
      const item = record as unknown as PluginRawDTO;

      return this.#mapItem(item, record);
    });
  }

  @trackable
  async getPopular(): Promise<PluginDTO[]> {
    const apps = await backend
      .collection('apps')
      .getList(0, 2, { expand: 'author', sort: '-downloads' });

    return apps.items.map(record => {
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

    const appsFolder = await environment.path.resolveResource('apps/');
    await environment.invoke('load_plugin_remotely', {
      resourcePath: appsFolder,
      pluginPath: destination,
    });
  }

  @trackable
  @authorized(['install_plugin'])
  async installPlugin(url: string) {
    const base = await environment.path.basename(url);
    const request = await fetch(url);
    const file = await request.blob();
    const localDataDir = await environment.path.appLocalDataDir();
    const destination = await environment.path.join(localDataDir, 'apps', base);

    await environment.fs.writeBinaryFile(destination, await file.arrayBuffer());

    const appsFolder = await environment.path.resolveResource('apps/');
    await environment.invoke('load_plugin_remotely', {
      resourcePath: appsFolder,
      pluginPath: destination,
    });
  }

  async initSingleModule(name: string, isWebBased: boolean) {
    const manifest = await this.readManifest(name, isWebBased);
    const localDataDir = await environment.path.appLocalDataDir();
    const tokensFile = await environment.path.join(localDataDir, 'remote', 'stdout.json');
    const rawTokens = await environment.fs.readTextFile(tokensFile);
    const credentials = JSON.parse(rawTokens);

    const remoteProcess = new KasifRemote(credentials.port, manifest.identifier);
    // @ts-expect-error
    window[manifest.identifier] = {
      remote: remoteProcess,
    };

    const plugin = await this.importModule(manifest, isWebBased);
    remoteProcess.setModule(plugin?.file);

    remoteProcess.addEventListener('ready', async () => {
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
    });
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
      const file = (await import(`${path}.js`)) as PluginImport['file'];

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
    let manifest: Record<'kasif', PluginModule>;

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
