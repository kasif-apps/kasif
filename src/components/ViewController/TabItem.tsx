import { useEffect, useRef } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';

import {
  ActionIcon,
  Sx,
  Tooltip,
  UnstyledButton,
  createStyles,
  getStylesRef,
  rem,
} from '@mantine/core';
import { useMergedRef } from '@mantine/hooks';

import {
  Transition,
  useTransitionController,
} from '@kasif/components/Transition/TransitionWrapper';
import { app, useSetting } from '@kasif/config/app';
import { LocaleString } from '@kasif/config/i18n';
import { animations } from '@kasif/util/misc';
import { DisplayRenderableNode, RenderableNode } from '@kasif/util/node-renderer';

import { IconX } from '@tabler/icons';

import { motion } from 'framer-motion';

const useStyles = createStyles((theme, { dragging }: { dragging: boolean }) => ({
  tab: {
    'height': '100%',
    'display': 'flex',
    'fontSize': 12,
    'maxWidth': 200,

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
      display: dragging ? 'none' : 'inline-block',
      marginLeft: 4,
      backgroundColor: 'transparent',
    },

    '& .content': {
      'display': 'flex',
      'alignItems': 'center',
      'gap': theme.spacing.xs,
      'lineHeight': 1,
      'fontWeight': 500,
      'padding': `0 4px 0 ${theme.spacing.xs}`,
      'borderRadius': theme.radius.sm,
      'transition': 'background-color 200ms ease',
      'backgroundColor': dragging
        ? theme.colorScheme === 'dark'
          ? theme.colors.dark[8]
          : theme.colors.gray[0]
        : 'transparent',
      'maxWidth': 400,
      'overflow': 'hidden',
      'textOverflow': 'ellipsis',
      'cursor': 'pointer',

      '& .indicator': {
        position: 'absolute',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
        borderRadius: theme.radius.sm,
        width: '100%',
        height: '100%',
        marginLeft: `-${rem(theme.spacing.xs)}`,
        zIndex: -1,
        boxShadow: theme.colorScheme === 'dark' ? 'none' : theme.shadows.xs,
      },

      '&.active': {
        ref: getStylesRef('active'),
        backgroundColor: 'transparent',
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
  title: LocaleString;
  icon: RenderableNode | null;
  active?: boolean;
  dragging?: boolean;
  beforeActive?: boolean;
  provided: DraggableProvided;
}

export function TabItem(props: TabItemProps) {
  const { id, title, icon, active, beforeActive, provided, dragging } = props;
  const { classes, cx } = useStyles({
    dragging: Boolean(dragging),
  });
  const ref = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRef(ref, provided.innerRef);
  const controller = useTransitionController(50);
  const [animationsEnabled] = useSetting<boolean>('enable-animations');

  useEffect(() => {
    app.viewManager.controllers.upsert(oldValue => ({
      [id]: { ...oldValue[id], handle: controller },
    }));
  }, []);

  const handleClose = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    app.viewManager.removeView(id);
  };

  useEffect(() => {
    setTimeout(() => {
      if (ref.current && active) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }, 200);
  }, [active]);

  const style: Sx = {
    ...provided.draggableProps.style,
    zIndex: 99,
    position: dragging ? 'absolute' : 'relative',
  };

  const button = (
    <UnstyledButton
      ref={mergedRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      sx={style}
      onClick={() => app.viewManager.setCurrentView(id)}
      component="div"
      data-contextmenu-field="view-handle"
      data-view-id={id}
      className={cx(classes.tab, active && 'active', beforeActive && 'before-active')}>
      <Tooltip
        openDelay={1000}
        sx={{ maxWidth: 400 }}
        multiline
        withinPortal
        label={app.localeManager.getI18nValue(title)}>
        <div className={cx('content', active && 'active')}>
          {icon && (
            <span className="tab-icon">
              <DisplayRenderableNode node={icon} />
            </span>
          )}
          <p className={classes.title}>{app.localeManager.getI18nValue(title)}</p>
          <ActionIcon className="close-icon" onClick={handleClose} size="xs" radius="xl">
            <IconX size={12} />
          </ActionIcon>

          {active &&
            (animationsEnabled.value ? (
              dragging ? (
                <div className="indicator" />
              ) : (
                <motion.div
                  className="indicator"
                  layoutId="indicator"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )
            ) : (
              <div className="indicator" />
            ))}
        </div>
      </Tooltip>
    </UnstyledButton>
  );

  if (dragging) {
    return button;
  }

  return (
    <Transition controller={controller} transition={animations.scale}>
      <span style={{ position: 'relative' }}>{button}</span>
    </Transition>
  );
}
