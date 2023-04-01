// import React from 'react';
import { App, nexus } from '@kasif/config/app';

const pluginImports = [
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
    pluginImports.forEach((mod, index) => {
      import(`/plugins/${mod.path}/entry.js`)
        .then((file) => {
          files.push({
            file,
            id: mod.id,
          });

          if (index === pluginImports.length - 1) {
            resolve(files);
          }
        })
        .catch((error) => {
          app.notificationManager.error(
            `Could not load plugin '${mod.name}'. Check the logs for more information.`,
            'Error Loading Plugin'
          );
          app.notificationManager.log(
            String(error.stack),
            `Loading '${mod.name}' (${mod.id}) plugin failed`
          );
        });
    });
  });
}

export async function initPlugins(_app: App) {
  const app = _app;

  const modules = await importModules(app);
  const plugins: Array<{ init: (app: App) => void; id: string }> = modules.map((mod) => ({
    init: mod.file.init,
    id: mod.id,
  }));
  plugins.forEach((plugin) => {
    const instance = pluginImports.find((mod) => mod.id === plugin.id);

    if (instance) {
      app.id = instance.id;
      app.name = instance.name;
      plugin.init(app);

      app.id = nexus.id;
      app.name = nexus.name;
      app.notificationManager.log(
        `Plugin '${instance.name}:${instance.id}' loaded successfully`,
        'Plugin loaded'
      );
    }
  });
}
