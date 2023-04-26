import React from 'react';

import { app } from '@kasif/config/app';

import { IconWindowMaximize, IconWindowMinimize } from '@tabler/icons';

import { t } from 'i18next';

export function initCommands() {
  app.commandManager.defineCommand({
    id: 'close-all-views',
    title: {
      en: 'Close All Views',
      tr: 'Tüm Sekmeleri Kapat',
    },
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
    title: {
      en: 'Close View',
      tr: 'Sekmeyi Kapat',
    },
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
    title: {
      en: 'Remove All Panes',
      tr: 'Tüm Panelleri Kaldır',
    },
    icon: () => React.createElement(IconWindowMinimize, { size: 14 }),
    shortCut: 'mod+Shift+P',
    onTrigger: async () => {
      app.paneManager.removeAllPanes();
    },
  });

  app.commandManager.defineCommand({
    id: 'creaete-pane',
    title: {
      en: 'Create Pane From View',
      tr: 'Bu Sekmeden Panel Oluştur',
    },
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
