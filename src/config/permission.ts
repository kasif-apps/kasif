import { App } from '@kasif/config/app';

import { LocaleString } from './i18n';

export const permissions = [
  'upload_plugin',
  'install_plugin',
  'load_plugin',
  'show_notifications',
  'show_prompts',
  'push_view',
  'push_pane',
  'remove_view',
  'set_view',
  'remove_pane',
  'replace_pane',
  'push_navbar_item',
  'remove_navbar_item',
  'define_command',
  'define_setting',
  'define_setting_category',
  'define_contextmenu_item',
  'define_contextmenu_category',
  'define_contextmenu_field',
  'open_contextmenu',
  'close_contextmenu',
  'kill_network_manager',
  'kill_contextmenu_manager',
  'reinit_permission_manager',
  'reinit_command_manager',
  'reinit_auth_manager',
  'reinit_plugin_manager',
  'reinit_network_manager',
  'revoke_permission',
  'read_user_data',
  'read_connection_data',
  'read_permission_data',
  'read_setting',
] as const;

export type PermissionType = (typeof permissions)[number];

export function getPermissionDescriptions(
  app: App
): Record<PermissionType, { label: LocaleString; description: LocaleString }> {
  return {
    upload_plugin: {
      label: app.localeManager.get('permission.upload-plugin.label'),
      description: app.localeManager.get('permission.upload-plugin.description'),
    },
    install_plugin: {
      label: app.localeManager.get('permission.install-plugin.label'),
      description: app.localeManager.get('permission.install-plugin.description'),
    },
    load_plugin: {
      label: app.localeManager.get('permission.load-plugin.label'),
      description: app.localeManager.get('permission.load-plugin.description'),
    },
    show_notifications: {
      label: app.localeManager.get('permission.show-notifications.label'),
      description: app.localeManager.get('permission.show-notifications.description'),
    },
    show_prompts: {
      label: app.localeManager.get('permission.show-prompts.label'),
      description: app.localeManager.get('permission.show-prompts.description'),
    },
    push_view: {
      label: app.localeManager.get('permission.push-view.label'),
      description: app.localeManager.get('permission.push-view.description'),
    },
    push_pane: {
      label: app.localeManager.get('permission.push-pane.label'),
      description: app.localeManager.get('permission.push-pane.description'),
    },
    remove_view: {
      label: app.localeManager.get('permission.remove-view.label'),
      description: app.localeManager.get('permission.remove-view.description'),
    },
    set_view: {
      label: app.localeManager.get('permission.set-view.label'),
      description: app.localeManager.get('permission.set-view.description'),
    },
    remove_pane: {
      label: app.localeManager.get('permission.remove-pane.label'),
      description: app.localeManager.get('permission.remove-pane.description'),
    },
    replace_pane: {
      label: app.localeManager.get('permission.replace-pane.label'),
      description: app.localeManager.get('permission.replace-pane.description'),
    },
    push_navbar_item: {
      label: app.localeManager.get('permission.push-navbar-item.label'),
      description: app.localeManager.get('permission.push-navbar-item.description'),
    },
    remove_navbar_item: {
      label: app.localeManager.get('permission.remove-navbar-item.label'),
      description: app.localeManager.get('permission.remove-navbar-item.description'),
    },
    define_command: {
      label: app.localeManager.get('permission.define-command.label'),
      description: app.localeManager.get('permission.define-command.description'),
    },
    define_setting: {
      label: app.localeManager.get('permission.define-setting.label'),
      description: app.localeManager.get('permission.define-setting.description'),
    },
    define_setting_category: {
      label: app.localeManager.get('permission.define-setting-category.label'),
      description: app.localeManager.get('permission.define-setting-category.description'),
    },
    define_contextmenu_item: {
      label: app.localeManager.get('permission.define-contextmenu-item.label'),
      description: app.localeManager.get('permission.define-contextmenu-item.description'),
    },
    define_contextmenu_category: {
      label: app.localeManager.get('permission.define-contextmenu-category.label'),
      description: app.localeManager.get('permission.define-contextmenu-category.description'),
    },
    define_contextmenu_field: {
      label: app.localeManager.get('permission.define-contextmenu-field.label'),
      description: app.localeManager.get('permission.define-contextmenu-field.description'),
    },
    kill_network_manager: {
      label: app.localeManager.get('permission.kill-network-manager.label'),
      description: app.localeManager.get('permission.kill-network-manager.description'),
    },
    kill_contextmenu_manager: {
      label: app.localeManager.get('permission.kill-contextmenu-manager.label'),
      description: app.localeManager.get('permission.kill-contextmenu-manager.description'),
    },
    reinit_permission_manager: {
      label: app.localeManager.get('permission.reinit-permission-manager.label'),
      description: app.localeManager.get('permission.reinit-permission-manager.description'),
    },
    reinit_command_manager: {
      label: app.localeManager.get('permission.reinit-command-manager.label'),
      description: app.localeManager.get('permission.reinit-command-manager.description'),
    },
    reinit_auth_manager: {
      label: app.localeManager.get('permission.reinit-auth-manager.label'),
      description: app.localeManager.get('permission.reinit-auth-manager.description'),
    },
    reinit_plugin_manager: {
      label: app.localeManager.get('permission.reinit-plugin-manager.label'),
      description: app.localeManager.get('permission.reinit-plugin-manager.description'),
    },
    reinit_network_manager: {
      label: app.localeManager.get('permission.reinit-network-manager.label'),
      description: app.localeManager.get('permission.reinit-network-manager.description'),
    },
    read_user_data: {
      label: app.localeManager.get('permission.read-user-data.label'),
      description: app.localeManager.get('permission.read-user-data.description'),
    },
    read_setting: {
      label: app.localeManager.get('permission.read-setting.label'),
      description: app.localeManager.get('permission.read-setting.description'),
    },
    read_connection_data: {
      label: app.localeManager.get('permission.read-connection-data.label'),
      description: app.localeManager.get('permission.read-connection-data.description'),
    },
    read_permission_data: {
      label: app.localeManager.get('permission.read-permission-data.label'),
      description: app.localeManager.get('permission.read-permission-data.description'),
    },
    revoke_permission: {
      label: app.localeManager.get('permission.revoke-permission.label'),
      description: app.localeManager.get('permission.revoke-permission.description'),
    },
    open_contextmenu: {
      label: app.localeManager.get('permission.open-contextmenu.label'),
      description: app.localeManager.get('permission.open-contextmenu.description'),
    },
    close_contextmenu: {
      label: app.localeManager.get('permission.close-contextmenu.label'),
      description: app.localeManager.get('permission.close-contextmenu.description'),
    },
  };
}
