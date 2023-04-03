import { App } from '@kasif/config/app';
import { tauri } from '@kasif/util/tauri';
import { resolveResource, appLocalDataDir, join, basename } from '@tauri-apps/api/path';

interface PluginModule {
  name: string;
  id: string;
  path: string;
}

export async function uploadPlugin(pluginPath: string) {
  const localDataDir = await appLocalDataDir();
  const base = await basename(pluginPath);
  const destination = await join(localDataDir, 'apps', base);

  await tauri.fs.copyFile(pluginPath, destination);
}

export async function initApps(_app: App) {
  const appsFolder = await resolveResource('apps/');

  async function importModules(
    app: App,
    modules: PluginModule[]
  ): Promise<{ file: { init: (app: App) => void }; meta: PluginModule }[]> {
    const files: { file: any; meta: PluginModule }[] = [];

    return new Promise((resolve) => {
      modules.forEach((mod, index) => {
        import(`${appsFolder}/${mod.path}/entry.js`)
          .then((file) => {
            files.push({
              file,
              meta: mod,
            });

            if (index === modules.length - 1) {
              resolve(files);
            }
          })
          .catch((error) => {
            app.notificationManager.error(
              `Could not load app '${mod.name}'. Check the logs for more information.`,
              'Error Loading App'
            );
            app.notificationManager.log(
              String(error.stack),
              `Loading '${mod.name}' (${mod.id}) app failed`
            );
          });
      });
    });
  }

  async function readManifest(path: string) {
    const raw_manifest = await tauri.fs.readTextFile(`${appsFolder}/${path}/package.json`, {
      dir: tauri.fs.BaseDirectory.Document,
    });

    const manifest = JSON.parse(raw_manifest);
    manifest.kasif.path = `${manifest.kasif.id}.kasif`;

    return manifest.kasif as PluginModule;
  }

  async function exploreModules(): Promise<PluginModule[]> {
    const entries = await tauri.fs.readDir(appsFolder);

    const readAll = () => {
      const manifests: PluginModule[] = [];
      return new Promise((resolve) => {
        entries.forEach(async (entry, index) => {
          if (entry.name && entry.name.endsWith('.kasif')) {
            manifests.push(await readManifest(entry.name));
          }

          if (index === entries.length - 1) {
            resolve(manifests);
          }
        });
      });
    };

    const manifests = (await readAll()) as PluginModule[];
    return manifests;
  }

  const app = _app;

  const modules = await exploreModules();
  const plugins = await importModules(app, modules);

  plugins.forEach((mod) => {
    const instance = mod.meta;

    app.notificationManager.log(
      `App '${instance.name}:${instance.id}' began loading`,
      'App loading'
    );

    const subapp = new App(app, {
      id: instance.id,
      name: instance.name,
      version: '0.0.1',
    });
    mod.file.init(subapp);

    app.notificationManager.log(
      `App '${instance.name}:${instance.id}' loaded successfully`,
      'App loaded'
    );
  });
}
