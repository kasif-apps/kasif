import { app } from './app';

export function initCommands() {
  app.commandManager.defineCommand({
    id: 'remove-all-panes',
    title: 'Remove All Panes',
    shortCut: 'mod+Shift+P',
    onTrigger: () => {
      app.paneManager.removeAllPanes();
    },
  });
}
