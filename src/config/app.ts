import { CommandManager } from '@kasif/managers/command';
import { NavbarManager } from '@kasif/managers/navbar';
import { NotificationManager } from '@kasif/managers/notification';
import { PaneManager } from '@kasif/managers/pane';
import { SettingsItem, SettingsManager } from '@kasif/managers/settings';
import { ThemeManager } from '@kasif/managers/theme';
import { ViewManager } from '@kasif/managers/view';
import { useSlice } from '@kasif/util/cinq-react';
import { BaseManager } from '@kasif/managers/base';
import { DndManager } from '@kasif/managers/dnd';
import { NetworkManager } from '@kasif/managers/network';

export const nexus = {
  id: 'nexus@v0.0.1',
  name: 'Nexus',
  version: '0.0.1',
};

export class App {
  id: string;
  name: string;
  version: string;
  viewManager: ViewManager;
  settingsManager: SettingsManager;
  themeManager: ThemeManager;
  notificationManager: NotificationManager;
  navbarManager: NavbarManager;
  paneManager: PaneManager;
  commandManager: CommandManager;
  dndManager: DndManager;
  networkManager: NetworkManager;
  contextMenuManager: null;

  customManagers: Map<string, BaseManager> = new Map();

  constructor(public parent?: App, options?: typeof nexus) {
    this.id = options?.id ?? nexus.id;
    this.name = options?.name ?? nexus.name;
    this.version = options?.version ?? nexus.version;

    this.settingsManager = new SettingsManager(this, this.parent);
    this.notificationManager = new NotificationManager(this, this.parent);
    this.viewManager = new ViewManager(this, this.parent);
    this.themeManager = new ThemeManager(this, this.parent);
    this.navbarManager = new NavbarManager(this, this.parent);
    this.paneManager = new PaneManager(this, this.parent);
    this.commandManager = new CommandManager(this, this.parent);
    this.dndManager = new DndManager(this, this.parent);
    this.networkManager = new NetworkManager(this, this.parent);
    this.contextMenuManager = null;
  }

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
