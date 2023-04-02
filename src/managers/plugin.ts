import { App } from '@kasif/config/app';

const apps = [
  {
    name: 'Plugin',
    id: 'plugin@v0.0.1',
    path: 'plugin',
  },
];

function importModules(app: App): Promise<{ file: { init: (app: App) => void }; id: string }[]> {
  const files: { file: any; id: string }[] = [];
  return new Promise((resolve) => {
    apps.forEach((mod, index) => {
      import(`../apps/${mod.path}/entry.js`)
        .then((file) => {
          files.push({
            file,
            id: mod.id,
          });

          if (index === apps.length - 1) {
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

export async function initApps(_app: App) {
  const app = _app;

  const modules = await importModules(app);
  const plugins: Array<{ init: (app: App) => void; id: string }> = modules.map((mod) => ({
    init: mod.file.init,
    id: mod.id,
  }));
  plugins.forEach((plugin) => {
    const instance = apps.find((mod) => mod.id === plugin.id);

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
