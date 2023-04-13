import { NavbarItem } from '@kasif/managers/navbar';
import { prebuiltViews } from '@kasif/config/view';
import { IconHome, IconPuzzle, IconSettings, IconShoppingBag, IconUser } from '@tabler/icons';
import { Avatar } from '@mantine/core';
import { useSlice } from '@kasif/util/cinq-react';
import { app } from './app';

export const initialTopItems: NavbarItem[] = [
  {
    id: 'home',
    icon: () => <IconHome size={20} stroke={1.5} />,
    label: 'Home',
    onClick: () => app.viewManager.setCurrentView(null),
  },
];

export const initialBottomItems: NavbarItem[] = [
  {
    id: 'store',
    icon: () => <IconShoppingBag size={20} stroke={1.5} />,
    label: 'Store',
    onClick: () => app.viewManager.pushView({ view: prebuiltViews.store }),
  },
  {
    id: 'plugins',
    icon: () => <IconPuzzle size={20} stroke={1.5} />,
    label: 'Plugins',
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
            sx={(theme) => ({
              border: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]
              }`,
            })}
          />
        );
      }

      return <IconUser size={20} stroke={1.5} />;
    },
    label: 'Profile',
    onClick: () => app.viewManager.pushView({ view: prebuiltViews.profile }),
  },
  {
    id: 'settings',
    icon: () => <IconSettings size={20} stroke={1.5} />,
    label: 'Settings',
    onClick: () => app.viewManager.pushView({ view: prebuiltViews.settings }),
  },
];
