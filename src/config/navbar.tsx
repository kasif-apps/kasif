import { Avatar } from '@mantine/core';

import { app } from '@kasif/config/app';
import { prebuiltViews } from '@kasif/config/view';
import { NavbarItem } from '@kasif/managers/navbar';
import { useSlice } from '@kasif/util/cinq-react';

import { IconHome, IconPuzzle, IconSettings, IconShoppingBag, IconUser } from '@tabler/icons';

export const initialTopItems: NavbarItem[] = [
  {
    id: 'home',
    icon: () => <IconHome size={20} stroke={1.5} />,
    label: {
      en: 'Home',
      tr: 'Anasayfa',
    },
    onClick: () => app.viewManager.setCurrentView(null),
  },
];

export const initialBottomItems: NavbarItem[] = [
  {
    id: 'store',
    icon: () => <IconShoppingBag size={20} stroke={1.5} />,
    label: {
      en: 'Store',
      tr: 'Mağaza',
    },
    onClick: () => app.viewManager.pushView({ view: prebuiltViews.store }),
  },
  {
    id: 'plugins',
    icon: () => <IconPuzzle size={20} stroke={1.5} />,
    label: {
      en: 'Plugins',
      tr: 'Eklentiler',
    },
    onClick: () => app.viewManager.pushView({ view: prebuiltViews.plugins }),
  },
  {
    id: 'profile',
    icon: () => {
      const [avatar] = useSlice(app.authManager.avatar);

      if (avatar.length > 0) {
        return (
          <Avatar
            size={24}
            radius="xl"
            src={avatar}
            sx={theme => ({
              border: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]
              }`,
            })}
          />
        );
      }

      return <IconUser size={20} stroke={1.5} />;
    },
    label: {
      en: 'Profile',
      tr: 'Profil',
    },
    onClick: () => app.viewManager.pushView({ view: prebuiltViews.profile }),
  },
  {
    id: 'settings',
    icon: () => <IconSettings size={20} stroke={1.5} />,
    label: {
      en: 'Settings',
      tr: 'Ayarlar',
    },
    onClick: () => app.viewManager.pushView({ view: prebuiltViews.settings }),
  },
];
