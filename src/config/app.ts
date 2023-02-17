import { CommandManager } from '@kasif/managers/command';
import { NavbarManager } from '@kasif/managers/navbar';
import { NotificationManager } from '@kasif/managers/notification';
import { PaneManager } from '@kasif/managers/pane';
import { SettingsItem, SettingsManager } from '@kasif/managers/settings';
import { ThemeManager } from '@kasif/managers/theme';
import { ViewManager } from '@kasif/managers/view';
import { useSlice } from '@kasif/util/cinq-react';

export class AppManager {
  viewManager = new ViewManager();
  settingsManager = new SettingsManager();
  themeManager = new ThemeManager();
  notificationManager = new NotificationManager();
  navbarManager = new NavbarManager();
  paneManager = new PaneManager();
  commandManager = new CommandManager();
  contextMenuManager = null;
}

export const app = new AppManager();

export function useSetting<T>(id: SettingsItem<T>['id']): [SettingsItem<T>, (value: T) => void] {
  const controller = app.settingsManager.getSettingController<T>(id)!;
  const [item] = useSlice(controller.instance);

  return [item, controller.update];
}
