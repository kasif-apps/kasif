import { ActionIcon, createStyles, Sx, Tooltip, UnstyledButton } from '@mantine/core';
import { IconX } from '@tabler/icons';
import { CSS } from '@dnd-kit/utilities';

import { useSortable } from '@dnd-kit/sortable';
import { app } from '@kasif/config/app';
import { useEffect, useRef } from 'react';
import { useMergedRef } from '@mantine/hooks';

const useStyles = createStyles((theme, _, getRef) => ({
  tab: {
    height: '100%',
    display: 'flex',
    fontSize: 12,
    transition: 'background-color 200ms ease',

    '& .tab-icon': {
      display: 'flex',
      alignItems: 'center',
    },

    '&:not(:last-child):not(.before-active):not(.active)::after': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
    },

    '&::after': {
      content: '""',
      width: 1,
      display: 'inline-block',
      marginLeft: 4,
      backgroundColor: 'transparent',
    },

    '& .content': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
      lineHeight: 1,
      fontWeight: 500,
      padding: `0 4px 0 ${theme.spacing.xs}px`,
      borderRadius: theme.radius.sm,
      transition: 'background-color 200ms ease',
      maxWidth: 400,
      overflow: 'hidden',
      textOverflow: 'ellipsis',

      '&.active': {
        ref: getRef('active'),
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
        boxShadow: theme.colorScheme === 'dark' ? 'none' : theme.shadows.xs,
      },
    },
  },

  title: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export interface TabItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  beforeActive?: boolean;
  preview?: boolean;
  onClick?: (id: TabItemProps['id']) => void;
}

export function TabItem({ id, title, icon, active, beforeActive, onClick, preview }: TabItemProps) {
  const { classes, cx } = useStyles();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const ref = useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRef(ref, setNodeRef);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    app.viewManager.removeView(id);
  };

  useEffect(() => {
    if (ref.current && active) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [active]);

  const style: Sx = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: 99,
    position: 'relative',
    opacity: preview ? 0.5 : 1,
  };

  return (
    <UnstyledButton
      // @ts-ignore
      ref={mergedRef}
      {...attributes}
      {...listeners}
      sx={style}
      onClick={() => onClick?.(id)}
      component="div"
      className={cx(classes.tab, active && 'active', beforeActive && 'before-active')}
    >
      <Tooltip openDelay={1000} sx={{ maxWidth: 400 }} multiline withinPortal label={title}>
        <div className={cx('content', active && 'active')}>
          <span className="tab-icon">{icon}</span>
          <p className={classes.title}>{title}</p>
          <ActionIcon className="close-icon" onClick={handleClose} size="xs" radius="xl">
            <IconX size={12} />
          </ActionIcon>
        </div>
      </Tooltip>
    </UnstyledButton>
  );
}
