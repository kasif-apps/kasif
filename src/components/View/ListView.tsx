import { createStyles, Stack } from '@mantine/core';
import { ReactComponent as FolderIcon } from '@kasif/assets/icons/folder.svg';
import { BaseView, BaseViewItem } from '@kasif/components/View/BaseView';
import { Transition } from '@kasif/components/Transition/TransitionWrapper';
import { animations } from '@kasif/util/misc';

const useStyles = createStyles((theme) => ({
  item: {
    height: 28,
    width: '100%',
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
    fontSize: theme.fontSizes.sm,
  },

  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

function ListViewItem({ icon: Icon, label, id }: FolderContentItem) {
  const { classes } = useStyles();

  return (
    <BaseViewItem id={id}>
      <div className={classes.item}>
        <Icon />
        <span className={classes.label}>{label}</span>
      </div>
    </BaseViewItem>
  );
}

interface FolderContentItem {
  id: string;
  label: string;
  icon: React.FC<any>;
}

const items: FolderContentItem[] = [
  { id: '1', label: 'item 1', icon: () => <FolderIcon height={20} /> },
  {
    id: '2',
    label: 'lorem ipsum',
    icon: () => <FolderIcon height={20} />,
  },
  { id: '3', label: 'item 3', icon: () => <FolderIcon height={20} /> },
  { id: '4', label: 'item 4', icon: () => <FolderIcon height={20} /> },
  { id: '5', label: 'item 5', icon: () => <FolderIcon height={20} /> },
  { id: '6', label: 'item 6', icon: () => <FolderIcon height={20} /> },
  { id: '7', label: 'item 7', icon: () => <FolderIcon height={20} /> },
  { id: '8', label: 'item 8', icon: () => <FolderIcon height={20} /> },
  { id: '9', label: 'item 9', icon: () => <FolderIcon height={20} /> },
  { id: '10', label: 'item 10', icon: () => <FolderIcon height={20} /> },
  { id: '11', label: 'item 11', icon: () => <FolderIcon height={20} /> },
  { id: '12', label: 'item 12', icon: () => <FolderIcon height={20} /> },
];

export function ListView() {
  return (
    <BaseView items={items.map((item) => item.id)}>
      <Stack px="sm" spacing={2}>
        {items.map((item, i) => (
          <Transition key={item.id} transition={animations.fallDown(i, items.length)}>
            <ListViewItem {...item} />
          </Transition>
        ))}
      </Stack>
    </BaseView>
  );
}
