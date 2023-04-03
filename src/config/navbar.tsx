import { NavbarItem } from '@kasif/managers/navbar';
import { prebuiltViews } from '@kasif/config/view';
import { IconHome, IconPuzzle, IconSettings, IconShoppingBag, IconUser } from '@tabler/icons';
import { RenderableNode } from '@kasif/util/node-renderer';
import { app } from './app';

export const initialTopItems: NavbarItem[] = [
  {
    id: 'home',
    icon: (() => <IconHome size={20} stroke={1.5} />) as unknown as RenderableNode,
    label: 'Home',
    onClick: () => app.viewManager.setCurrentView(null),
  },
];

export const initialBottomItems: NavbarItem[] = [
  {
    id: 'store',
    icon: (() => <IconShoppingBag size={20} stroke={1.5} />) as unknown as RenderableNode,
    label: 'Store',
    onClick: () => app.viewManager.pushView({ view: prebuiltViews.store }),
  },
  {
    id: 'plugins',
    icon: (() => <IconPuzzle size={20} stroke={1.5} />) as unknown as RenderableNode,
    label: 'Plugins',
  },
  {
    id: 'profile',
    icon: (() => <IconUser size={20} stroke={1.5} />) as unknown as RenderableNode,
    label: 'Profile',
    onClick: () => app.viewManager.pushView({ view: prebuiltViews.profile }),
  },
  {
    id: 'settings',
    icon: (() => <IconSettings size={20} stroke={1.5} />) as unknown as RenderableNode,
    label: 'Settings',
    onClick: () => app.viewManager.pushView({ view: prebuiltViews.settings }),
  },
];
