import { Avatar } from '@mantine/core';

import { App } from '@kasif/config/app';
import { View, WelcomeSection } from '@kasif/managers/view';
import { LogsPage } from '@kasif/pages/LogsPage';
import { PermissionsPage } from '@kasif/pages/PermissionsPage';
import { PluginsPage } from '@kasif/pages/PluginsPage';
import { ProfilePage } from '@kasif/pages/ProfilePage';
import { SettingsPage } from '@kasif/pages/SettingsPage';
import { StorePage } from '@kasif/pages/StorePage';
import { useSlice } from '@kasif/util/cinq-react';

import {
  IconBackspace,
  IconBrandTypescript,
  IconCode,
  IconCoffee,
  IconFolder,
  IconGitCommit,
  IconHelp,
  IconLicense,
  IconMessages,
  IconPlus,
  IconPuzzle,
  IconRotateRectangle,
  IconSettings,
  IconShoppingBag,
  IconUser,
  IconUsers,
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

export function getInitialWelcomeSections(): Record<string, WelcomeSection> {
  return {
    'kasif': {
      id: 'kasif',
      title: {
        en: 'Getting Started',
        tr: 'Başlarken',
      },
      by: 'Kâşif',
      items: [
        {
          type: 'action-card',
          id: 'install-plugins',
          title: {
            en: 'Install Plugins',
            tr: 'Eklenti İndir',
          },
          icon: () => <IconPuzzle stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'action-card',
          id: 'create-plugin',
          title: {
            en: 'Create Plugin',
            tr: 'Eklenti Oluştur',
          },
          icon: () => <IconPlus stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'action-card',
          id: 'contribute',
          title: {
            en: 'Contribute',
            tr: 'Katkı Yap',
          },
          icon: () => <IconCode stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'action-card',
          id: 'support',
          title: {
            en: 'Support',
            tr: 'Destek Al',
          },
          icon: () => <IconHelp stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'action-card',
          id: 'join-community',
          title: {
            en: 'Join Community',
            tr: 'Topluluğa Katıl',
          },
          icon: () => <IconUsers stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'action-card',
          id: 'fund',
          title: {
            en: 'Fund',
            tr: 'Destek Ol',
          },
          icon: () => <IconCoffee stroke={1.5} size={32} />,
          onClick: () => {},
        },
      ],
    },
    'the-explorer-pinned': {
      id: 'the-explorer-pinned',
      by: 'The Explorer',
      title: {
        en: 'Pinned',
        tr: 'Sabitlenenler',
      },
      items: [
        {
          type: 'action-card',
          id: '/Users/muhammedalican/Documents/repos/kasif',
          title: {
            en: 'kasif',
          },
          icon: () => <IconFolder stroke={1.5} size={32} />,
          onClick: () => {},
        },
      ],
    },
    'the-explorer-recent': {
      id: 'the-explorer-recent',
      by: 'The Explorer',
      title: {
        en: 'Recent',
        tr: 'Son Kullanılanlar',
      },
      items: [
        {
          type: 'action-card',
          id: '/Users/muhammedalican/Desktop',
          title: {
            en: 'Desktop',
          },
          icon: () => <IconFolder stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'action-card',
          id: '/Users/muhammedalican/Downloads',
          title: {
            en: 'Downloads',
          },
          icon: () => <IconFolder stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'info-card',
          id: 'file-info-main.tsx',
          icon: () => <IconBrandTypescript stroke={1.5} size={32} />,
          title: {
            en: 'main.tsx',
          },
          description: {
            en: 'You opened "main.tsx" 3 times in the last 2 days.',
          },
        },
        {
          type: 'action-card',
          id: '/Users/muhammedalican/Documents/repos/kasif',
          title: {
            en: 'kasif',
          },
          icon: () => <IconFolder stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'action-card',
          id: '/Users/muhammedalican/Documents/repos',
          title: {
            en: 'repos',
          },
          icon: () => <IconFolder stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'action-card',
          id: '/Users/muhammedalican/Documents',
          title: {
            en: 'Documents',
          },
          icon: () => <IconFolder stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'info-card',
          id: 'file-info-common.json',
          icon: () => <IconCode stroke={1.5} size={32} />,
          title: {
            en: 'common.json',
          },
          description: {
            en: 'You opened "common.json" 2 times in the last 4 days.',
          },
        },
        {
          type: 'action-card',
          id: '/Users/muhammedalican/Documents/design',
          title: {
            en: 'design',
          },
          icon: () => <IconFolder stroke={1.5} size={32} />,
          onClick: () => {},
        },
      ],
    },
    'git-explorer': {
      id: 'git-explorer',
      by: 'Git Explorer',
      title: {
        en: "What's New",
        tr: 'Güncel',
      },
      items: [
        {
          type: 'info-card',
          id: 'commit',
          icon: () => <IconGitCommit stroke={1.5} size={32} />,
          title: {
            en: 'You Commited 2 days ago',
          },
          description: {
            en: '"refactor: fix minor ui problems and prettier parser" 12c889b',
          },
        },
        {
          type: 'action-card',
          id: 'update',
          title: {
            en: 'Update',
          },
          icon: () => <IconRotateRectangle stroke={1.5} size={32} />,
          onClick: () => {},
        },
        {
          type: 'action-card',
          id: 'uninstall',
          title: {
            en: 'Uninstall',
          },
          icon: () => <IconBackspace stroke={1.5} size={32} />,
          onClick: () => {},
        },
      ],
    },
  };
}
