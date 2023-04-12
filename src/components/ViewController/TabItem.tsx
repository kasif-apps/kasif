import { ActionIcon, createStyles, Sx, Tooltip, UnstyledButton, getStylesRef } from '@mantine/core';
import { IconX } from '@tabler/icons';

import { app } from '@kasif/config/app';
import { useEffect, useRef } from 'react';
import { useMergedRef } from '@mantine/hooks';

import { DraggableProvided } from 'react-beautiful-dnd';
import { DisplayRenderableNode, RenderableNode } from '@kasif/util/node-renderer';
import { useSlice } from '@kasif/util/cinq-react';

const useStyles = createStyles(
  (theme, { dragging, isHomeView }: { dragging: boolean; isHomeView: boolean }) => ({
    tab: {
      height: '100%',
      display: 'flex',
      fontSize: 12,
      marginRight: isHomeView ? 5 : 0,

      '& .tab-icon': {
        display: 'flex',
        alignItems: 'center',
      },

      '&:not(:last-child):not(.before-active):not(.active)::after': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
      },

      '& .close-icon': {
        color: isHomeView ? theme.white : 'auto',

        '&:hover, &:focus': {
          backgroundColor: isHomeView ? theme.colors.red[6] : 'auto',
        },
      },

      '&::after': {
        content: '""',
        width: 1,
        display: isHomeView ? 'none' : dragging ? 'none' : 'inline-block',
        marginLeft: 4,
        backgroundColor: 'transparent',
      },

      '& .content': {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
        lineHeight: 1,
        fontWeight: 500,
        padding: `0 4px 0 ${theme.spacing.xs}`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 200ms ease',
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.fn.rgba(theme.colors.dark[8], isHomeView ? 0.3 : 1)
            : theme.fn.rgba(theme.colors.gray[0], isHomeView ? 0.1 : 1),

        backdropFilter: 'blur(5px)',
        maxWidth: 400,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        cursor: 'initial',
        color: isHomeView ? theme.white : 'auto',

        '&.active': {
          ref: getStylesRef('active'),
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
  })
);

export interface TabItemProps {
  id: string;
  title: string;
  icon: RenderableNode | null;
  active?: boolean;
  dragging?: boolean;
  beforeActive?: boolean;
  provided: DraggableProvided;
}

export function TabItem(props: TabItemProps) {
  const { id, title, icon, active, beforeActive, provided, dragging } = props;
  const [viewStore] = useSlice(app.viewManager.store);
  const { classes, cx } = useStyles({
    dragging: Boolean(dragging),
    isHomeView: viewStore.currentView === null,
  });
  const ref = useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRef(ref, provided.innerRef);

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
    ...provided.draggableProps.style,
    zIndex: 99,
    position: 'relative',
  };

  return (
    <UnstyledButton
      // @ts-ignore
      ref={mergedRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      sx={style}
      onClick={() => app.viewManager.setCurrentView(id)}
      component="div"
      data-contextmenu-field="view-handle"
      data-view-id={id}
      className={cx(classes.tab, active && 'active', beforeActive && 'before-active')}
    >
      <Tooltip openDelay={1000} sx={{ maxWidth: 400 }} multiline withinPortal label={title}>
        <div className={cx('content', active && 'active')}>
          {icon && (
            <span className="tab-icon">
              <DisplayRenderableNode node={icon} />
            </span>
          )}
          <p className={classes.title}>{title}</p>
          <ActionIcon className="close-icon" onClick={handleClose} size="xs" radius="xl">
            <IconX size={12} />
          </ActionIcon>
        </div>
      </Tooltip>
    </UnstyledButton>
  );
}
