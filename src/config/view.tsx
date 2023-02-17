import React from 'react';
import { View } from '@kasif/managers/view';
import { ProfilePage } from '@kasif/pages/ProfilePage';
import { SettingsPage } from '@kasif/pages/SettingsPage';
import { StorePage } from '@kasif/pages/StorePage';
import { IconSettings, IconUser, IconShoppingBag } from '@tabler/icons';

export const prebuiltViews: Record<string, View> = {
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: <IconSettings size={18} stroke={1.5} />,
    render: SettingsPage,
  },
  profile: {
    id: 'profile',
    title: 'Profile',
    icon: <IconUser size={18} stroke={1.5} />,
    render: ProfilePage,
  },
  store: {
    id: 'store',
    title: 'Store',
    icon: <IconShoppingBag size={18} stroke={1.5} />,
    render: StorePage,
  },
};
