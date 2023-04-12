import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconFolders,
  IconInfoSquare,
  IconLayoutDashboard,
  IconPin,
  IconRefresh,
} from '@tabler/icons';
import { App } from '@kasif/config/app';
import { RenderableNode } from '@kasif/util/node-renderer';

export type ToolbarItemPlacement = 'navigation' | 'action' | 'custom' | 'contextual';

export interface ToolbarItem {
  id: string;
  label: string;
  icon: RenderableNode;
  onClick: () => void;
  placement: ToolbarItemPlacement;
  disabled?: (app: App) => boolean;
  predefined: boolean;
}

export const initialToolbarItems: ToolbarItem[] = [
  {
    id: 'backwards',
    label: 'Back',
    icon: () => <IconArrowLeft size={18} />,
    onClick: () => {},
    placement: 'navigation',
    predefined: true,
  },
  {
    id: 'forwards',
    label: 'Forward',
    icon: () => <IconArrowRight size={18} />,
    onClick: () => {},
    placement: 'navigation',
    predefined: true,
  },
  {
    id: 'upwards',
    label: 'Up',
    icon: () => <IconArrowUp size={18} />,
    onClick: () => {},
    placement: 'navigation',
    predefined: true,
  },
  {
    id: 'refresh',
    label: 'Refresh',
    icon: () => <IconRefresh size={18} />,
    onClick: () => {},
    placement: 'navigation',
    predefined: true,
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: () => <IconInfoSquare size={18} />,
    onClick: () => {},
    placement: 'contextual',
    predefined: true,
  },
  // {
  //   id: 'cut',
  //   label: 'Cut',
  //   icon: () => <IconCut size={18} />,
  //   onClick: () => {},
  //   placement: 'action',
  //   disabled: (app) => app.contentManager.selection.get().length === 0,
  //   predefined: true,
  // },
  // {
  //   id: 'copy',
  //   label: 'Copy',
  //   icon: () => <IconCopy size={18} />,
  //   onClick: () => {},
  //   placement: 'action',
  //   disabled: (app) => app.contentManager.selection.get().length === 0,
  //   predefined: true,
  // },
  // {
  //   id: 'paste',
  //   label: 'Paste',
  //   icon: () => <IconClipboard size={18} />,
  //   onClick: () => {},
  //   placement: 'action',
  //   disabled: (app) => app.contentManager.clipboard.get().length === 0,
  //   predefined: true,
  // },
  // {
  //   id: 'rename',
  //   label: 'Rename',
  //   icon: () => <IconCursorText size={18} />,
  //   onClick: () => {},
  //   placement: 'action',
  //   disabled: (app) => app.contentManager.selection.get().length !== 1,
  //   predefined: true,
  // },
  // {
  //   id: 'delete',
  //   label: 'Delete',
  //   icon: () => <IconTrash size={18} />,
  //   onClick: () => {},
  //   placement: 'action',
  //   disabled: (app) => app.contentManager.selection.get().length === 0,
  //   predefined: true,
  // },
  {
    id: 'pin',
    label: 'Pin View',
    icon: () => <IconPin size={18} />,
    onClick: () => {},
    placement: 'custom',
    predefined: true,
  },
  {
    id: 'duplicate',
    label: 'Duplicate View',
    icon: () => <IconFolders size={18} />,
    onClick: () => {},
    placement: 'custom',
    predefined: true,
  },
  {
    id: 'change-layout',
    label: 'Change Layout',
    icon: () => <IconLayoutDashboard size={18} />,
    onClick: () => {},
    placement: 'custom',
    predefined: true,
  },
];
