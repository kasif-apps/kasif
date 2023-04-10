import { app } from '@kasif/config/app';
import { IconWindowMaximize, IconWindowMinimize } from '@tabler/icons';
import React from 'react';

export function initCommands() {
  app.commandManager.defineCommand({
    id: 'close-all-view',
    title: 'Close All View',
    shortCut: 'mod+Shift+W',
    onTrigger: async () => {
      const store = app.viewManager.store.get();

      store.views.forEach((view) => {
        app.viewManager.removeView(view.id);
      });
    },
  });

  app.commandManager.defineCommand({
    id: 'close-view',
    title: 'Close View',
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
    title: 'Remove All Panes',
    icon: () => React.createElement(IconWindowMinimize, { size: 14 }),
    shortCut: 'mod+Shift+P',
    onTrigger: async () => {
      app.paneManager.removeAllPanes();
    },
  });

  app.commandManager.defineCommand({
    id: 'creaete-pane',
    title: 'Create Pane From View',
    shortCut: 'mod+P',
    icon: () => React.createElement(IconWindowMaximize, { size: 14 }),
    onTrigger: async () => {
      const view = app.viewManager.store.get().currentView;

      if (view) {
        const pane = app.paneManager.createPaneFromView(view)!;
        app.paneManager.pushPane(pane);
        app.viewManager.removeView(view);
      } else {
        app.notificationManager.error('Select a view to create a pane', 'No view is selected');
      }
    },
  });
}
