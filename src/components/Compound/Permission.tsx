import { PermissionType } from '@kasif/managers/permission';
import { Stack, Text } from '@mantine/core';

export function Permission({ label, description }: { label: string; description: string }) {
  return (
    <Stack spacing={0}>
      <Text size="sm" fw="bold">
        {label}
      </Text>
      <Text size="sm">{description}</Text>
    </Stack>
  );
}

export const labels: Record<PermissionType, { label: string; description: string }> = {
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
  push_view: {
    label: 'push_view',
    description: '',
  },
  push_pane: {
    label: 'push_pane',
    description: '',
  },
  remove_view: {
    label: 'remove_view',
    description: '',
  },
  set_view: {
    label: 'set_view',
    description: '',
  },
  remove_pane: {
    label: 'remove_pane',
    description: '',
  },
  replace_pane: {
    label: 'replace_pane',
    description: '',
  },
  push_navbar_item: {
    label: 'push_navbar_item',
    description: '',
  },
  remove_navbar_item: {
    label: 'remove_navbar_item',
    description: '',
  },
  define_command: {
    label: 'Denfine Command',
    description:
      'Define a command that has a shortcut can be executed by the user via the shortcut or the command center',
  },
  define_setting: {
    label: 'define_setting',
    description: '',
  },
  define_setting_category: {
    label: 'define_setting_category',
    description: '',
  },
  define_contextmenu_item: {
    label: 'define_contextmenu_item',
    description: '',
  },
  define_contextmenu_category: {
    label: 'define_contextmenu_category',
    description: '',
  },
  define_contextmenu_field: {
    label: 'define_contextmenu_field',
    description: '',
  },
  kill_network_manager: {
    label: 'kill_network_manager',
    description: '',
  },
  kill_contextmenu_manager: {
    label: 'kill_contextmenu_manager',
    description: '',
  },
  reinit_permission_manager: {
    label: 'reinit_permission_manager',
    description: '',
  },
  reinit_command_manager: {
    label: 'reinit_command_manager',
    description: '',
  },
  reinit_auth_manager: {
    label: 'reinit_auth_manager',
    description: '',
  },
  reinit_plugin_manager: {
    label: 'reinit_plugin_manager',
    description: '',
  },
  reinit_network_manager: {
    label: 'reinit_network_manager',
    description: '',
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
  revoke_permission: {
    label: 'Revoke Permission',
    description: 'Revoking a permission of an app on behalf of you',
  },
  open_contextmenu: {
    label: 'Open Contextmenu',
    description: '',
  },
  close_contextmenu: {
    label: 'Close Contetxmenu',
    description: '',
  },
};

export function Permissions({ permissions }: { permissions: PermissionType[] }) {
  return (
    <Stack spacing="sm">
      {permissions.map((permission) => (
        <Permission key={permission} {...labels[permission]} />
      ))}

      <Text size="xs" color="dimmed">
        You can revoke any of these permissions at any time.
      </Text>
    </Stack>
  );
}
