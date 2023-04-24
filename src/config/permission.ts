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

export const permissionDescriptions: Record<
  PermissionType,
  { label: string; description: string }
> = {
  upload_plugin: {
    label: 'Upload Plugin',
    description: 'Uploading a plugin on behalf of you',
  },
  install_plugin: {
    label: 'Install Plugin',
    description: 'Installing a plugin on behalf of you',
  },
  load_plugin: {
    label: 'Load Plugin',
    description: 'Loading a plugin on behalf of you from a a provided source',
  },
  show_notifications: {
    label: 'Show Notifications',
    description:
      'Showing notifications to infrom you. These may include infos and success, warning or error messages',
  },
  show_prompts: {
    label: 'Show Prompts',
    description:
      'Showing prompts to infrom you or get information from you. These may include inputs, confirmations and alerts',
  },
  push_view: {
    label: 'Push View',
    description: 'Pushing a view on the screen',
  },
  push_pane: {
    label: 'Push Pane',
    description: 'Pushing a pane on the screen',
  },
  remove_view: {
    label: 'Remove View',
    description: 'Removing a view from the screen',
  },
  set_view: {
    label: 'Set View',
    description: 'Settin a view as an active view',
  },
  remove_pane: {
    label: 'Remove Pane',
    description: 'Removing a pane from the screen',
  },
  replace_pane: {
    label: 'Replace Pane',
    description: "Replacing a pane's content with another pane",
  },
  push_navbar_item: {
    label: 'Push Navbar Item',
    description: 'Pushing a navigation item on the left side of the screen, either top or bottom',
  },
  remove_navbar_item: {
    label: 'Remove Navbar Item',
    description:
      'Removing a navigation item from the left side of the screen, either top or bottom',
  },
  define_command: {
    label: 'Denfine Command',
    description:
      'Defining a command that has a shortcut can be executed by the user via the shortcut or the command center',
  },
  define_setting: {
    label: 'Define Setting',
    description: 'Defining a settnig item that would be displayed on the settings page',
  },
  define_setting_category: {
    label: 'Define Setting Category',
    description: 'Defining a setting category that would group setting items',
  },
  define_contextmenu_item: {
    label: 'Define Context Menu Item',
    description:
      'Defining a context menu item that would be visible when user right clicks the app',
  },
  define_contextmenu_category: {
    label: 'Define Context Menu Category',
    description: 'Defining a context menu category that would group context menu items',
  },
  define_contextmenu_field: {
    label: 'Define Context Menu Field',
    description:
      'Defining a special context menu field that would give a context to the menu item and make it appear on certain places of the app',
  },
  kill_network_manager: {
    label: 'Kill Network Manager',
    description: 'Killing network manager features, this may cause the app to malfunction',
  },
  kill_contextmenu_manager: {
    label: 'Kill Context Menu Manager',
    description: 'Killing context menu manager features, this may cause the app to malfunction',
  },
  reinit_permission_manager: {
    label: 'Reinit Permission Manager',
    description: "Initizalizing the app's permission manager at any time, this may be dangereous",
  },
  reinit_command_manager: {
    label: 'Reinit Command Manager',
    description: "Initizalizing the app's command manager at any time, this may be dangereous",
  },
  reinit_auth_manager: {
    label: 'Reinit Auth Manager',
    description:
      "Initizalizing the app's authentication manager at any time, this may be dangereous",
  },
  reinit_plugin_manager: {
    label: 'Reinit Plugin Manager',
    description: "Initizalizing the app's plugin manager at any time, this is dangereous",
  },
  reinit_network_manager: {
    label: 'Reinit Network Manager',
    description: "Initizalizing the app's network manager at any time",
  },
  read_user_data: {
    label: 'Read User Data',
    description:
      'Reading user information including settings, plugins, etc. and other sensitive data',
  },
  read_setting: {
    label: 'Read Setting',
    description: 'Reading an arbitrary setting of the app',
  },
  read_connection_data: {
    label: 'Read Connection Data',
    description: 'Reading network connection information',
  },
  read_permission_data: {
    label: 'Read Permission Data',
    description: "Reading any apps' permission information",
  },
  revoke_permission: {
    label: 'Revoke Permission',
    description: 'Revoking a permission of an app on behalf of you',
  },
  open_contextmenu: {
    label: 'Open Contextmenu',
    description: 'Opening a context menu on the screen at any time',
  },
  close_contextmenu: {
    label: 'Close Contetxmenu',
    description: 'Closing the context menu on the screen at any time',
  },
};
