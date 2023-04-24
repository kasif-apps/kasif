import { Avatar } from '@mantine/core';

import { app } from '@kasif/config/app';
import { View } from '@kasif/managers/view';
import { LogsPage } from '@kasif/pages/LogsPage';
import { PermissionsPage } from '@kasif/pages/PermissionsPage';
import { PluginsPage } from '@kasif/pages/PluginsPage';
import { ProfilePage } from '@kasif/pages/ProfilePage';
import { SettingsPage } from '@kasif/pages/SettingsPage';
import { StorePage } from '@kasif/pages/StorePage';
import { useSlice } from '@kasif/util/cinq-react';

import {
  IconLicense,
  IconMessages,
  IconPuzzle,
  IconSettings,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons';

export const prebuiltViews: Record<string, View> = {
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: () => <IconSettings size={18} stroke={1.5} />,
    render: SettingsPage,
  },
  profile: {
    id: 'profile',
    title: 'Profile',
    icon: () => {
      const [avatar] = useSlice(app.authManager.avatar);

      if (avatar.length > 0) {
        return <Avatar size={20} radius="xl" src={avatar} />;
      }

      return <IconUser size={18} stroke={1.5} />;
    },
    render: ProfilePage,
  },
  store: {
    id: 'store',
    title: 'Store',
    icon: () => <IconShoppingBag size={18} stroke={1.5} />,
    render: StorePage,
  },
  plugins: {
    id: 'plugins',
    title: 'Plugins',
    icon: () => <IconPuzzle size={18} stroke={1.5} />,
    render: PluginsPage,
  },
  logs: {
    id: 'logs',
    title: 'Logs',
    icon: () => <IconMessages size={18} stroke={1.5} />,
    render: LogsPage,
  },
  permissions: {
    id: 'permissions',
    title: 'Permissions',
    icon: () => <IconLicense size={18} stroke={1.5} />,
    render: PermissionsPage,
  },
};
