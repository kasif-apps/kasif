import { NavbarItem } from '@kasif/managers/navbar';
import { prebuiltViews } from '@kasif/config/view';
import { getIcon } from '@kasif/util/icon';
import { IconHome, IconPuzzle, IconSettings, IconShoppingBag, IconUser } from '@tabler/icons';
import { ContentView } from '@kasif/components/View/ContentView';
import { app } from './app';

function folderIcon(Icon: Awaited<ReturnType<typeof getIcon>>) {
  return () => <Icon width={22} />;
}

const icon = {
  downloads: folderIcon(await getIcon('downloads', 'folder')),
  documents: folderIcon(await getIcon('documents', 'folder')),
  music: folderIcon(await getIcon('music', 'folder')),
  pictures: folderIcon(await getIcon('pictures', 'folder')),
  videos: folderIcon(await getIcon('videos', 'folder')),
  applications: folderIcon(await getIcon('apps', 'folder')),
  desktop: folderIcon(await getIcon('desktop', 'folder')),
};

export const initialTopItems: NavbarItem[] = [
  {
    id: 'home',
    icon: () => <IconHome size={20} stroke={1.5} />,
    label: 'Home',
    onClick: () => app.viewManager.setCurrentView(null),
  },
  {
    id: 'downloads',
    icon: icon.downloads,
    label: 'Downloads',
    onClick: () =>
      app.viewManager.pushView({
        id: 'downloads',
        title: 'Downloads',
        icon: <icon.downloads />,
        render: ContentView,
      }),
  },
  {
    id: 'documents',
    icon: folderIcon(await getIcon('documents', 'folder')),
    label: 'Documents',
    onClick: () =>
      app.viewManager.pushView({
        id: 'documents',
        title: 'Documents',
        icon: <icon.documents />,
        render: ContentView,
      }),
  },
  {
    id: 'applications',
    icon: folderIcon(await getIcon('apps', 'folder')),
    label: 'Applications',
    onClick: () =>
      app.viewManager.pushView({
        id: 'applications',
        title: 'Applications',
        icon: <icon.applications />,
        render: ContentView,
      }),
  },
  {
    id: 'desktop',
    icon: folderIcon(await getIcon('desktop', 'folder')),
    label: 'Desktop',
    onClick: () =>
      app.viewManager.pushView({
        id: 'desktop',
        title: 'Desktop',
        icon: <icon.desktop />,
        render: ContentView,
      }),
  },
];

export const initialBottomItems: NavbarItem[] = [
  {
    id: 'store',
    icon: () => <IconShoppingBag size={20} stroke={1.5} />,
    label: 'Store',
    onClick: () => app.viewManager.pushView(prebuiltViews.store),
  },
  { id: 'plugins', icon: () => <IconPuzzle size={20} stroke={1.5} />, label: 'Plugins' },
  {
    id: 'profile',
    icon: () => <IconUser size={20} stroke={1.5} />,
    label: 'Profile',
    onClick: () => app.viewManager.pushView(prebuiltViews.profile),
  },
  {
    id: 'settings',
    icon: () => <IconSettings size={20} stroke={1.5} />,
    label: 'Settings',
    onClick: () => app.viewManager.pushView(prebuiltViews.settings),
  },
];
