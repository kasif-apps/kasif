import { App } from '@kasif/config/app';
import { tauri } from '@kasif/util/tauri';

interface PluginModule {
  name: string;
  id: string;
  path: string;
}

function importModules(
  app: App,
  modules: PluginModule[]
): Promise<{ file: { init: (app: App) => void }; id: string }[]> {
  const files: { file: any; id: string }[] = [];

  return new Promise((resolve) => {
    modules.forEach((mod, index) => {
      import(`/apps/${mod.path}/entry.js`)
        .then((file) => {
          files.push({
            file,
            id: mod.id,
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
  const raw_manifest = await tauri.fs.readTextFile(`repos/kasif/public/apps/${path}/package.json`, {
    dir: tauri.fs.BaseDirectory.Document,
  });

  const manifest = JSON.parse(raw_manifest);

  return manifest.nexus as PluginModule;
}

async function exploreModules(): Promise<PluginModule[]> {
  const entries = await tauri.fs.readDir('repos/kasif/public/apps', {
    dir: tauri.fs.BaseDirectory.Document,
    recursive: false,
  });

  const readAll = () => {
    const manifests: PluginModule[] = [];
    return new Promise((resolve) => {
      entries.forEach(async (entry, index) => {
        if (entry.name) {
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

export async function initApps(_app: App) {
  const app = _app;

  const modules = await exploreModules();

  const importedModules = await importModules(app, modules);
  const plugins: Array<{ init: (app: App) => void; id: string }> = importedModules.map((mod) => ({
    init: mod.file.init,
    id: mod.id,
  }));

  plugins.forEach((plugin) => {
    const instance = modules.find((mod) => mod.id === plugin.id);

    if (instance) {
      app.notificationManager.log(
        `App '${instance.name}:${instance.id}' began loading`,
        'App loading'
      );

      const subapp = new App(app, {
        id: instance.id,
        name: instance.name,
        version: '0.0.1',
      });
      plugin.init(subapp);

      app.notificationManager.log(
        `App '${instance.name}:${instance.id}' loaded successfully`,
        'App loaded'
      );
    }
  });
}
