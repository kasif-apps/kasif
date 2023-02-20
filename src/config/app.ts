import { CommandManager } from '@kasif/managers/command';
import { NavbarManager } from '@kasif/managers/navbar';
import { NotificationManager } from '@kasif/managers/notification';
import { PaneManager } from '@kasif/managers/pane';
import { SettingsItem, SettingsManager } from '@kasif/managers/settings';
import { ThemeManager } from '@kasif/managers/theme';
import { ViewManager } from '@kasif/managers/view';
import { useSlice } from '@kasif/util/cinq-react';
import { BaseManager } from '@kasif/managers/base';
import { FolderContentManager } from '@kasif/managers/content';
import { DndManager } from '@kasif/managers/dnd';
import { NetworkManager } from '@kasif/managers/network';

export class App {
  viewManager = new ViewManager();
  settingsManager = new SettingsManager();
  themeManager = new ThemeManager();
  notificationManager = new NotificationManager();
  navbarManager = new NavbarManager();
  paneManager = new PaneManager();
  commandManager = new CommandManager();
  contentManager = new FolderContentManager();
  dndManager = new DndManager();
  networkManager = new NetworkManager();
  contextMenuManager = null;

  customManagers: Map<string, BaseManager> = new Map();

  defineCustomManager(id: string, manager: BaseManager) {
    this.customManagers.set(id, manager);
  }

  getCustomManager<T extends BaseManager>(id: string): T {
    return this.customManagers.get(id) as T;
  }
}

export const app = new App();

export function useSetting<T>(id: SettingsItem<T>['id']): [SettingsItem<T>, (value: T) => void] {
  const controller = app.settingsManager.getSettingController<T>(id)!;
  const [item] = useSlice(controller.instance);

  return [item, controller.update];
}
