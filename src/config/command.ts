import { app } from '@kasif/config/app';
import { prebuiltViews } from '@kasif/config/view';

export function initCommands() {
  app.commandManager.defineCommand({
    id: 'remove-all-panes',
    title: 'Remove All Panes',
    shortCut: 'mod+Shift+P',
    onTrigger: () => {
      app.paneManager.removeAllPanes();
    },
  });

  app.commandManager.defineCommand({
    id: 'creaete-pane',
    title: 'Create Pane From View',
    shortCut: 'mod+P',
    onTrigger: () => {
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

  app.commandManager.defineCommand({
    id: 'open-logs',
    title: 'Open Logs',
    shortCut: 'mod+Shift+L',
    onTrigger: () => {
      app.viewManager.pushView(prebuiltViews.logs);
    },
  });
}
