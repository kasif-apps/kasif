import React from 'react';

import { app } from '@kasif/config/app';

import { IconWindowMaximize, IconWindowMinimize } from '@tabler/icons';

import { t } from 'i18next';

export function initCommands() {
  app.commandManager.defineCommand({
    id: 'close-all-views',
    title: app.localeManager.get('command.close-all-views'),
    shortCut: 'mod+Shift+W',
    onTrigger: async () => {
      const store = app.viewManager.store.get();

      store.views.forEach(view => {
        app.viewManager.removeView(view.id);
      });
    },
  });

  app.commandManager.defineCommand({
    id: 'close-view',
    title: app.localeManager.get('command.close-view'),

    shortCut: 'mod+W',
    onTrigger: async () => {
      const store = app.viewManager.store.get();

      if (store.currentView) {
        app.viewManager.removeView(store.currentView);
      }
    },
  });

  app.commandManager.defineCommand({
    id: 'remove-all-panes',
    title: app.localeManager.get('command.remove-all-panes'),
    icon: () => React.createElement(IconWindowMinimize, { size: 14 }),
    shortCut: 'mod+Shift+P',
    onTrigger: async () => {
      app.paneManager.removeAllPanes();
    },
  });

  app.commandManager.defineCommand({
    id: 'create-pane',
    title: app.localeManager.get('command.create-pane'),
    shortCut: 'mod+P',
    icon: () => React.createElement(IconWindowMaximize, { size: 14 }),
    onTrigger: async () => {
      const view = app.viewManager.store.get().currentView;

      if (view) {
        const pane = app.paneManager.createPaneFromView(view)!;
        app.paneManager.pushPane(pane);
        app.viewManager.removeView(view);
      } else {
        app.notificationManager.error(
          t('notification.no-view-selected.description'),
          t('notification.no-view-selected.title')!
        );
      }
    },
  });
}
