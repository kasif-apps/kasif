import { IconArticle, IconRefresh } from '@tabler/icons';
import React from 'react';
import { App } from './app';
import { prebuiltViews } from './view';

export function initAppContextMenu(app: App) {
  app.contextMenuManager.defineField('app');

  app.contextMenuManager.defineCategory({
    id: 'app',
    title: 'App',
    order: 0,
  });

  app.contextMenuManager.defineItem('app', {
    id: 'reload',
    title: 'Reload App',
    shortCut: 'mod+r',
    icon: () => React.createElement(IconRefresh, { size: 14 }),
    async onTrigger() {
      return window.location.reload();
    },
    category: 'app',
  });

  app.contextMenuManager.defineItem('app', {
    id: 'open-logs',
    title: 'Open Logs',
    shortCut: 'mod+Shift+L',
    icon: () => React.createElement(IconArticle, { size: 14 }),
    onTrigger: async () => {
      app.viewManager.pushView({ view: prebuiltViews.logs });
    },
    category: 'app',
  });
}
