import { Avatar } from '@mantine/core';

import { App } from '@kasif/config/app';
import { NavbarItem } from '@kasif/managers/navbar';
import { useSlice } from '@kasif/util/cinq-react';

import { IconHome, IconPuzzle, IconSettings, IconShoppingBag, IconUser } from '@tabler/icons';

export function getInitialTopItems(app: App): NavbarItem[] {
  return [
    {
      id: 'home',
      icon: () => <IconHome size={20} stroke={1.5} />,
      label: app.localeManager.get('title.home'),
      onClick: () => app.viewManager.setCurrentView(null),
    },
  ];
}

export function getInitialBottomItems(app: App): NavbarItem[] {
  return [
    {
      id: 'store',
      icon: () => <IconShoppingBag size={20} stroke={1.5} />,
      label: app.localeManager.get('title.store'),
      onClick: () => app.viewManager.pushView({ view: app.viewManager.prebuiltViews.store }),
    },
    {
      id: 'plugins',
      icon: () => <IconPuzzle size={20} stroke={1.5} />,
      label: app.localeManager.get('title.plugins'),
      onClick: () => app.viewManager.pushView({ view: app.viewManager.prebuiltViews.plugins }),
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
      label: app.localeManager.get('title.profile'),
      onClick: () => app.viewManager.pushView({ view: app.viewManager.prebuiltViews.profile }),
    },
    {
      id: 'settings',
      icon: () => <IconSettings size={20} stroke={1.5} />,
      label: app.localeManager.get('title.settings'),
      onClick: () => app.viewManager.pushView({ view: app.viewManager.prebuiltViews.settings }),
    },
  ];
}
