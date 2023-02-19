import { createStyles, Stack } from '@mantine/core';
import { ReactComponent as FolderIcon } from '@kasif/assets/icons/folder.svg';
import { BaseView, BaseViewItem } from '@kasif/components/View/BaseView';

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
];

export function ListView() {
  return (
    <BaseView items={items.map((item) => item.id)}>
      <Stack px="sm" spacing={2}>
        {items.map((item) => (
          <ListViewItem {...item} key={item.id} />
        ))}
      </Stack>
    </BaseView>
  );
}
