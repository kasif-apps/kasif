import { NavbarItem } from '@kasif/managers/navbar';
import { prebuiltViews } from '@kasif/config/view';
import { IconHome, IconPuzzle, IconSettings, IconShoppingBag, IconUser } from '@tabler/icons';
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
    icon: () => <IconUser size={20} stroke={1.5} />,
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
