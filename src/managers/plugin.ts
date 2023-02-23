import React from 'react';
import { App } from '@kasif/config/app';
import { IconAdjustments, IconBrandVscode, IconTerminal2 } from '@tabler/icons';
import { BooleanAction } from '@kasif/config/settings';

const dummyPlugin = {
  init(app: App) {
    app.settingsManager.defineCategory({
      id: 'custom',
      title: 'Custom',
      description: 'Custom settings.',
      color: 'red',
    });

    app.settingsManager.defineSetting({
      id: 'custom',
      title: 'Custom',
      description: 'Custom setting.',
      category: 'custom',
      value: false,
      render: () => React.createElement(BooleanAction, { id: 'custom' }),
    });

    app.commandManager.defineCommand({
      id: 'push-view',
      title: 'Push View',
      shortCut: 'mod+shift+o',
      onTrigger: () =>
        app.viewManager.pushView({
          id: `custom-${Date.now()}`,
          title:
            'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam',
          icon: React.createElement('p', null, 'H'),
          render: () => React.createElement('p', null, `custom-${Date.now()}`),
        }),
    });

    app.commandManager.defineCommand({
      id: 'add-navbar-item',
      title: 'Add Navbar Item',
      onTrigger: () =>
        app.navbarManager.pushTopItem({
          id: 'custom',
          label: 'Custom',
          icon: () => React.createElement(IconAdjustments, { size: 20, stroke: 1.5 }),
          onClick: () => app.notificationManager.warn('Message from navbar item', 'Look at me!'),
        }),
    });

    app.contentManager.defineToolbarItem({
      id: 'open-vs-code',
      label: 'Open VS Code Here',
      icon: () => React.createElement(IconBrandVscode, { size: 20, stroke: 1.5 }),
      onClick: () => {},
      placement: 'custom',
    });

    app.contentManager.defineToolbarItem({
      id: 'open-terminal',
      label: 'Open Terminal Here',
      icon: () => React.createElement(IconTerminal2, { size: 20, stroke: 1.5 }),
      onClick: () => {},
      placement: 'custom',
    });

    app.themeManager.defineTheme({
      id: 'blue',
      title: 'Blue',
      description: 'Custom theme.',
      theme: {
        ui: {
          primaryColor: 'blue',
          colorScheme: 'light',
        },
      },
    });

    app.themeManager.defineTheme({
      id: 'blue-dark',
      title: 'Blue Dark',
      description: 'Custom theme.',
      theme: {
        ui: {
          primaryColor: 'blue',
          colorScheme: 'dark',
        },
      },
    });

    app.themeManager.defineTheme({
      id: 'dracula',
      title: 'Dracula',
      description: 'Unoffical dracula theme.',
      theme: {
        ui: {
          primaryColor: 'indigo',
          colorScheme: 'dark',
          colors: {
            dark: [
              '#f8f8f2',
              '#f8f8f2',
              '#889acf',
              '#6272a4',
              '#6272a4',
              '#44475a',
              '#343745',
              '#282a36',
              '#1d1f29',
              '#20222b',
            ],
            red: [
              '#FFF5F5',
              '#FFE3E3',
              '#FFC9C9',
              '#FFA8A8',
              '#FF8787',
              '#ff5555',
              '#FA5252',
              '#F03E3E',
              '#E03131',
              '#C92A2A',
            ],
          },
        },
      },
    });
  },
};

const plugins = [dummyPlugin];

export function initPlugins(app: App) {
  plugins.forEach((plugin) => plugin.init(app));
}
