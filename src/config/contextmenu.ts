import { getFirstNodeInPath } from '@kasif/util/misc';
import { openSpotlight } from '@mantine/spotlight';
import {
  IconCode,
  IconLicense,
  IconMessages,
  IconRefresh,
  IconSettings,
  IconTerminal2,
  IconWindowMinimize,
} from '@tabler/icons';
import React from 'react';
import { invoke } from '@tauri-apps/api';
import { App } from './app';
import { prebuiltViews } from './view';

export function initAppContextMenu(app: App) {
  app.contextMenuManager.defineField('app');
  app.contextMenuManager.defineField('pane');
  app.contextMenuManager.defineField('view-handle');
  app.contextMenuManager.defineField('view-handle-bar');

  app.contextMenuManager.defineCategory({
    id: 'app',
    title: 'App',
    order: 0,
  });

  app.contextMenuManager.defineCategory({
    id: 'view',
    title: 'View',
    order: 1,
  });

  app.contextMenuManager.defineCategory({
    id: 'settings',
    title: 'Settings',
    order: 2,
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
    registerCommand: true,
  });

  app.contextMenuManager.defineItem('app', {
    id: 'open-logs',
    title: 'Open Logs',
    shortCut: 'mod+Shift+L',
    icon: () => React.createElement(IconMessages, { size: 14 }),
    onTrigger: async () => {
      app.viewManager.pushView({ view: prebuiltViews.logs });
    },
    category: 'app',
    registerCommand: true,
  });

  app.contextMenuManager.defineItem('app', {
    id: 'open-command-center',
    title: 'Open Command Center',
    icon: () => React.createElement(IconTerminal2, { size: 14 }),
    onTrigger: async () => {
      openSpotlight();
    },
    category: 'app',
  });

  app.contextMenuManager.defineItem('pane', {
    id: 'close-this-pane',
    title: 'Close This Pane',
    icon: () => React.createElement(IconWindowMinimize, { size: 14 }),
    onTrigger: async () => {
      const path = app.contextMenuManager.currentPath.get();
      const element = getFirstNodeInPath(path, 'data-pane-id');

      if (element) {
        const id = element.getAttribute('data-pane-id');

        if (id) {
          app.paneManager.removePane(id);
        }
      }
    },
    category: 'app',
  });

  app.contextMenuManager.defineItem('view-handle', {
    id: 'close-this-view',
    title: 'Close This View',
    shortCut: 'mod+W',
    onTrigger: async () => {
      const path = app.contextMenuManager.currentPath.get();
      const element = getFirstNodeInPath(path, 'data-view-id');

      if (element) {
        const id = element.getAttribute('data-view-id');

        if (id) {
          app.viewManager.removeView(id);
        }
      }
    },
    async condition() {
      return app.viewManager.store.get().currentView !== null;
    },
    category: 'view',
  });

  app.contextMenuManager.defineItem('view-handle-bar', {
    id: 'close-all-views',
    title: 'Close All Views',
    shortCut: 'mod+shift+W',
    onTrigger: async () => {
      const store = app.viewManager.store.get();

      store.views.forEach((view) => {
        app.viewManager.removeView(view.id);
      });
    },
    async condition() {
      return app.viewManager.store.get().views.length > 0;
    },
    category: 'view',
  });

  app.contextMenuManager.defineItem('app', {
    id: 'open-settings',
    title: 'Open Settings',
    shortCut: 'mod+alt+S',
    icon: () => React.createElement(IconSettings, { size: 14 }),
    onTrigger: async () => {
      app.viewManager.pushView({ view: prebuiltViews.settings });
    },
    category: 'settings',
    registerCommand: true,
  });

  app.contextMenuManager.defineItem('app', {
    id: 'edit-permissions',
    title: 'Edit Permissions',
    shortCut: 'mod+shift+K',
    icon: () => React.createElement(IconLicense, { size: 14 }),
    onTrigger: async () => {
      app.viewManager.pushView({ view: prebuiltViews.permissions });
    },
    category: 'settings',
    registerCommand: true,
  });

  app.contextMenuManager.defineItem('app', {
    id: 'open-devtools',
    title: 'Open Devtools',
    shortCut: 'mod+alt+I',
    icon: () => React.createElement(IconCode, { size: 14 }),
    onTrigger: async () => {
      invoke('open_devtools');
    },
    category: 'settings',
    registerCommand: true,
  });
}
