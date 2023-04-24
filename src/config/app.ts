import { AuthManager } from '@kasif/managers/auth';
import { BaseManager } from '@kasif/managers/base';
import { CommandManager } from '@kasif/managers/command';
import { ContextMenuManager } from '@kasif/managers/contextmenu';
import { DndManager } from '@kasif/managers/dnd';
import { NavbarManager } from '@kasif/managers/navbar';
import { NetworkManager } from '@kasif/managers/network';
import { NotificationManager } from '@kasif/managers/notification';
import { PaneManager } from '@kasif/managers/pane';
import { PermissionManager } from '@kasif/managers/permission';
import { PluginManager } from '@kasif/managers/plugin';
import { PromptManager } from '@kasif/managers/prompt';
import { SettingsItem, SettingsManager } from '@kasif/managers/settings';
import { ThemeManager } from '@kasif/managers/theme';
import { ViewManager } from '@kasif/managers/view';
import { useSlice } from '@kasif/util/cinq-react';

import { createRecordSlice } from '@kasif-apps/cinq';

export const kasif = {
  id: 'kasif@v0.0.1',
  name: 'Kâşif',
  version: '0.0.1',
};

export interface AppFlags {
  debug: boolean;
  plugins: string[];
}

export class App {
  id: string;
  name: string;
  version: string;

  viewManager: ViewManager;
  permissionManager: PermissionManager;
  authManager: AuthManager;
  settingsManager: SettingsManager;
  themeManager: ThemeManager;
  notificationManager: NotificationManager;
  navbarManager: NavbarManager;
  paneManager: PaneManager;
  commandManager: CommandManager;
  dndManager: DndManager;
  networkManager: NetworkManager;
  contextMenuManager: ContextMenuManager;
  promptManager: PromptManager;
  pluginManager: PluginManager;

  customManagers: Map<string, BaseManager> = new Map();

  flags = createRecordSlice<AppFlags>(
    {
      debug: false,
      plugins: [],
    },
    { key: 'app-flags' }
  );

  constructor(public parent?: App, options?: typeof kasif) {
    this.id = options?.id ?? kasif.id;
    this.name = options?.name ?? kasif.name;
    this.version = options?.version ?? kasif.version;

    this.permissionManager = new PermissionManager(this, this.parent);
    this.settingsManager = new SettingsManager(this, this.parent);
    this.notificationManager = new NotificationManager(this, this.parent);
    this.viewManager = new ViewManager(this, this.parent);
    this.authManager = new AuthManager(this, this.parent);
    this.themeManager = new ThemeManager(this, this.parent);
    this.navbarManager = new NavbarManager(this, this.parent);
    this.paneManager = new PaneManager(this, this.parent);
    this.commandManager = new CommandManager(this, this.parent);
    this.contextMenuManager = new ContextMenuManager(this, this.parent);
    this.dndManager = new DndManager(this, this.parent);
    this.networkManager = new NetworkManager(this, this.parent);
    this.promptManager = new PromptManager(this, this.parent);
    this.pluginManager = new PluginManager(this, this.parent);
  }

  defineCustomManager(id: string, manager: BaseManager) {
    this.customManagers.set(id, manager);
  }

  getCustomManager<T extends BaseManager>(id: string): T {
    return this.customManagers.get(id) as T;
  }

  init() {
    this.contextMenuManager.init();
    this.permissionManager.init();
    this.networkManager.init();
    this.commandManager.init();
    this.authManager.init();
    this.pluginManager.init();
  }

  kill() {
    this.networkManager.kill();
    this.contextMenuManager.kill();
  }
}

export const app = new App();

export function useSetting<T>(id: SettingsItem<T>['id']): [SettingsItem<T>, (value: T) => void] {
  const controller = app.settingsManager.getSettingController<T>(id)!;
  const [item] = useSlice(controller.instance);

  return [item, controller.update];
}
