import { Avatar } from '@mantine/core';

import { App } from '@kasif/config/app';
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

export function getPrebuiltViews(app: App): Record<string, View> {
  return {
    settings: {
      id: 'settings',
      title: app.localeManager.get('title.settings'),
      icon: () => <IconSettings size={18} stroke={1.5} />,
      render: SettingsPage,
    },
    profile: {
      id: 'profile',
      title: app.localeManager.get('title.profile'),
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
      title: app.localeManager.get('title.store'),
      icon: () => <IconShoppingBag size={18} stroke={1.5} />,
      render: StorePage,
    },
    plugins: {
      id: 'plugins',
      title: {
        en: 'Plugins',
        tr: 'Eklentiler',
      },
      icon: () => <IconPuzzle size={18} stroke={1.5} />,
      render: PluginsPage,
    },
    logs: {
      id: 'logs',
      title: app.localeManager.get('title.logs'),
      icon: () => <IconMessages size={18} stroke={1.5} />,
      render: LogsPage,
    },
    permissions: {
      id: 'permissions',
      title: app.localeManager.get('title.permissions'),
      icon: () => <IconLicense size={18} stroke={1.5} />,
      render: PermissionsPage,
    },
  };
}
