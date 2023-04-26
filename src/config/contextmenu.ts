import React from 'react';

import { notifications } from '@mantine/notifications';
import { openSpotlight } from '@mantine/spotlight';

import { App } from '@kasif/config/app';
import { environment } from '@kasif/util/environment';
import { getFirstNodeInPath } from '@kasif/util/misc';

import {
  IconCode,
  IconEgg,
  IconExternalLink,
  IconLicense,
  IconMessages,
  IconNotification,
  IconNotificationOff,
  IconRefresh,
  IconSettings,
  IconTerminal2,
  IconWindowMinimize,
} from '@tabler/icons';

import { t } from 'i18next';

export function initAppContextMenu(app: App) {
  app.contextMenuManager.defineField('app');
  app.contextMenuManager.defineField('pane');
  app.contextMenuManager.defineField('view-handle');
  app.contextMenuManager.defineField('view-handle-bar');
  app.contextMenuManager.defineField('notifications');
  app.contextMenuManager.defineField('easter-egg');

  app.contextMenuManager.defineCategory({
    id: 'app',
    title: app.localeManager.get('contextmenu.category.app'),
    order: 0,
  });

  app.contextMenuManager.defineCategory({
    id: 'view',
    title: app.localeManager.get('contextmenu.category.view'),
    order: 1,
  });

  app.contextMenuManager.defineCategory({
    id: 'more',
    title: app.localeManager.get('contextmenu.category.more'),
    order: 2,
  });

  app.contextMenuManager.defineCategory({
    id: 'easter-egg',
    title: app.localeManager.get('contextmenu.category.easter-egg'),
    order: 99,
  });

  app.contextMenuManager.defineItem('app', {
    id: 'reload',
    title: app.localeManager.get('contextmenu.item.reload'),
    shortCut: 'mod+r',
    icon: () => React.createElement(IconRefresh, { size: 14 }),
    async onTrigger() {
      return window.location.reload();
    },
    category: 'app',
    registerCommand: true,
  });

  app.contextMenuManager.defineItem('pane', {
    id: 'close-this-pane',
    title: app.localeManager.get('contextmenu.item.close-this-pane'),
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
    title: app.localeManager.get('contextmenu.item.close-this-view'),
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
    title: app.localeManager.get('contextmenu.item.close-all-views'),
    shortCut: 'mod+shift+W',
    onTrigger: async () => {
      const store = app.viewManager.store.get();

      store.views.forEach(view => {
        app.viewManager.removeView(view.id);
      });
    },
    async condition() {
      return app.viewManager.store.get().views.length > 0;
    },
    category: 'view',
  });

  app.contextMenuManager.defineItem('notifications', {
    id: 'clear-this-notification',
    title: app.localeManager.get('contextmenu.item.clear-this-notification'),
    icon: () => React.createElement(IconNotification, { size: 14 }),
    onTrigger: async () => {
      const path = app.contextMenuManager.currentPath.get();
      const element = getFirstNodeInPath(path, 'id');
      const id = element?.getAttribute('id');

      if (id) {
        notifications.hide(id);
      }
    },
    category: 'app',
  });

  app.contextMenuManager.defineItem('notifications', {
    id: 'clear-all-notifications',
    title: app.localeManager.get('contextmenu.item.clear-all-notifications'),
    icon: () => React.createElement(IconNotificationOff, { size: 14 }),
    onTrigger: async () => {
      notifications.clean();
    },
    category: 'app',
  });

  app.contextMenuManager.defineItem('app', {
    id: 'open',
    title: app.localeManager.get('contextmenu.item.open'),
    icon: () => React.createElement(IconExternalLink, { size: 14 }),
    category: 'more',
    children: [
      {
        id: 'open-settings',
        title: app.localeManager.get('title.settings'),
        shortCut: 'mod+alt+S',
        icon: () => React.createElement(IconSettings, { size: 14 }),
        onTrigger: async () => {
          app.viewManager.pushView({ view: app.viewManager.prebuiltViews.settings });
        },
        category: 'app',
        registerCommand: true,
      },
      {
        id: 'open-command-center',
        title: app.localeManager.get('contextmenu.item.command-center'),
        icon: () => React.createElement(IconTerminal2, { size: 14 }),
        onTrigger: async () => {
          openSpotlight();
        },
        category: 'app',
      },
      {
        id: 'open-logs',
        title: app.localeManager.get('title.logs'),
        shortCut: 'mod+Shift+L',
        icon: () => React.createElement(IconMessages, { size: 14 }),
        onTrigger: async () => {
          app.viewManager.pushView({ view: app.viewManager.prebuiltViews.logs });
        },
        category: 'app',
        registerCommand: true,
      },
      {
        id: 'open-devtools',
        title: app.localeManager.get('contextmenu.item.devtools'),
        shortCut: 'mod+alt+I',
        icon: () => React.createElement(IconCode, { size: 14 }),
        onTrigger: async () => {
          environment.invoke('open_devtools');
        },
        category: 'app',
        registerCommand: environment.currentEnvironment === 'desktop',
        condition: async () =>
          environment.currentEnvironment === 'desktop' && app.flags.get().debug,
      },
      {
        id: 'open-permissions',
        title: app.localeManager.get('title.permissions'),
        shortCut: 'mod+shift+K',
        icon: () => React.createElement(IconLicense, { size: 14 }),
        onTrigger: async () => {
          app.viewManager.pushView({ view: app.viewManager.prebuiltViews.permissions });
        },
        category: 'app',
        registerCommand: true,
      },
    ],
  });

  app.contextMenuManager.defineItem('easter-egg', {
    id: 'easter-egg',
    title: app.localeManager.get('contextmenu.item.easter-egg'),
    icon: () => React.createElement(IconEgg, { size: 14 }),
    onTrigger: async () => {
      app.notificationManager.success('🙃', t('easter-egg.message')!);
    },
    category: 'easter-egg',
    condition: async () => app.viewManager.store.get().currentView === 'settings',
  });
}
