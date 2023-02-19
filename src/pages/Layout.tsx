import React from 'react';
import { KasifHeader, KasifNavbar, KasifFooter } from '@kasif/components/Navigation';
import { ActionIcon, AppShell, createStyles, ScrollArea, ScrollAreaProps } from '@mantine/core';
import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import SplitPane from 'react-split-pane';
import { Pane } from '@kasif/managers/pane';
import { useHover } from '@mantine/hooks';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import { IconX } from '@tabler/icons';

const useStyles = createStyles((theme, { isDragging }: { isDragging: boolean }) => ({
  paneFreeDropArea: {
    position: 'absolute',
    top: 'var(--mantine-header-height)',
    right: 0,
    width: 140,
    height: 'calc(100vh - var(--mantine-header-height) - var(--mantine-footer-height))',
    pointerEvents: isDragging ? 'auto' : 'none',
    backgroundColor: 'transparent',

    '& .overlay': {
      pointerEvents: isDragging ? 'auto' : 'none',
      backgroundColor: 'transparent',
      width: '100%',
      height: '100%',
      transition: 'background-color 300ms ease',
      position: 'relative',
      zIndex: 999,

      '&.active': {
        backgroundColor: theme.fn.rgba(theme.colors[theme.primaryColor][5], 0.2),
      },
    },
  },

  paneBusyDropArea: {
    width: '100%',
    height: '100%',

    '& .overlay': {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      transition: 'background-color 300ms ease',
      position: 'absolute',
      top: 0,
      left: 0,

      '&.active': {
        backgroundColor: theme.fn.rgba(theme.colors[theme.primaryColor][5], 0.2),
      },
    },
  },

  paneCloser: {
    position: 'absolute',
    top: 0,
    right: theme.spacing.sm,
    zIndex: 99,
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,

    '&:hover': {
      opacity: 1,
    },
  },
}));

const CustomScrollArea = (props: ScrollAreaProps) => (
  <ScrollArea
    scrollbarSize={10}
    sx={{
      height: 'calc(100vh - var(--mantine-header-height) - var(--mantine-footer-height))',
    }}
    {...props}
  >
    {props.children}
  </ScrollArea>
);

const PaneItem = (props: { children: React.ReactNode; id: string; droppable: boolean }) => {
  const [isDragging] = useSlice(app.dndManager.isDragging);
  const { classes, cx } = useStyles({ isDragging });
  const { hovered, ref: paneDropAreaRef } = useHover();

  if (!props.droppable) {
    return <>{props.children}</>;
  }

  return (
    <Droppable droppableId={`busy-pane-id:${props.id}`}>
      {(provided: DroppableProvided) => (
        <div
          className={cx(classes.paneBusyDropArea)}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div data-non-drag-source className={classes.paneCloser}>
            <ActionIcon
              onClick={() => app.paneManager.removePane(props.id)}
              radius="xl"
              variant="light"
            >
              <IconX size={16} />
            </ActionIcon>
          </div>
          {props.children}
          <div
            style={{ zIndex: isDragging ? 99 : -1 }}
            ref={paneDropAreaRef}
            className={cx('overlay', isDragging && hovered && 'active')}
          />
        </div>
      )}
    </Droppable>
  );
};

export function Layout() {
  const [isDragging] = useSlice(app.dndManager.isDragging);
  const { classes, cx } = useStyles({ isDragging });
  const [{ currentView }] = useSlice(app.viewManager.store);
  const { hovered, ref: paneDropAreaRef } = useHover();
  const [paneStore] = useSlice(app.paneManager.store);

  const Component = app.viewManager.getViewComponent(currentView);
  const panes: Pane[] = [{ id: '0', render: Component }, ...paneStore.panes];

  return (
    <AppShell
      navbar={<KasifNavbar />}
      header={<KasifHeader />}
      footer={<KasifFooter />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          paddingTop: 'calc(var(--mantine-header-height, 0px))',
          paddingBottom: 'calc(var(--mantine-footer-height, 0px))',
          paddingLeft: 'calc(var(--mantine-navbar-width, 0px))',
          paddingRight: 'calc(var(--mantine-aside-width, 0px))',
        },
      })}
    >
      {panes.length > 1 ? (
        // @ts-ignore
        <SplitPane size="50%" split="vertical">
          {panes.map((pane, index) => (
            <PaneItem droppable={index !== 0} id={pane.id} key={pane.id}>
              <CustomScrollArea>
                {React.createElement(pane.render, { key: pane.id })}
              </CustomScrollArea>
            </PaneItem>
          ))}
        </SplitPane>
      ) : (
        <CustomScrollArea>
          <Component />
        </CustomScrollArea>
      )}

      <Droppable droppableId="free-pane">
        {(provided: DroppableProvided) => (
          <div
            className={cx(classes.paneFreeDropArea)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div
              ref={paneDropAreaRef}
              className={cx('overlay', isDragging && hovered && 'active')}
            />
          </div>
        )}
      </Droppable>
    </AppShell>
  );
}
