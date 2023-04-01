// import React from 'react';
import { App, nexus } from '@kasif/config/app';

const apps = [
  {
    name: 'Test',
    id: 'test@v0.0.1',
    path: 'test',
  },
  {
    name: 'Another',
    id: 'another@v0.0.1',
    path: 'another',
  },
];

function importModules(app: App): Promise<{ file: { init: (app: App) => void }; id: string }[]> {
  const files: { file: any; id: string }[] = [];
  return new Promise((resolve) => {
    apps.forEach((mod, index) => {
      import(`/apps/${mod.path}/entry.js`)
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

      app.id = instance.id;
      app.name = instance.name;
      plugin.init(app);

      app.id = nexus.id;
      app.name = nexus.name;

      app.notificationManager.log(
        `App '${instance.name}:${instance.id}' loaded successfully`,
        'App loaded'
      );
    }
  });
}
