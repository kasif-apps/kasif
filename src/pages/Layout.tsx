import React, { useEffect, useRef } from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';

import {
  AppShell,
  Box,
  MantineTransition,
  ScrollArea,
  ScrollAreaProps,
  createStyles,
  useMantineTheme,
} from '@mantine/core';

import { ContextMenu } from '@kasif/components/Compound/ContextMenu';
import { KasifFooter, KasifHeader, KasifNavbar } from '@kasif/components/Navigation';
import {
  Transition,
  useTransitionController,
} from '@kasif/components/Transition/TransitionWrapper';
import { app } from '@kasif/config/app';
import { LanguageSetting } from '@kasif/config/settings';
import { useSlice } from '@kasif/util/cinq-react';
import { animations } from '@kasif/util/misc';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';

import SplitPane, { SashContent, Pane as SplitPaneView } from 'split-pane-react';

const useStyles = createStyles((theme, { isDragging }: { isDragging: boolean }) => ({
  paneFreeDropArea: {
    'position': 'absolute',
    'pointerEvents': isDragging ? 'auto' : 'none',
    'backgroundColor': 'transparent',

    '& .overlay': {
      'pointerEvents': isDragging ? 'auto' : 'none',
      'backgroundColor': 'transparent',
      'width': '100%',
      'height': '100%',
      'transition': 'background-color 300ms ease',
      'position': 'relative',
      'zIndex': 999,

      '&.active': {
        backgroundColor: theme.fn.rgba(theme.colors[theme.primaryColor][5], 0.2),
      },
    },
  },

  right: {
    top: 'calc(var(--mantine-header-height, 0px) + var(--titlebar-height, 0px))',
    right: 0,
    width: 140,
    height:
      'calc(100vh - var(--mantine-header-height) - var(--titlebar-height) - var(--mantine-footer-height))',
  },

  bottom: {
    bottom: 'var(--mantine-footer-height, 0px)',
    left: 'var(--mantine-navbar-width)',
    width: 'calc(100vw - var(--mantine-navbar-width))',
    height: 100,
  },

  paneBusyDropArea: {
    'width': '100%',
    'height': '100%',

    '& .overlay': {
      'width': '100%',
      'height': '100%',
      'backgroundColor': 'transparent',
      'transition': 'background-color 300ms ease',
      'position': 'absolute',
      'top': 0,
      'left': 0,

      '&.active': {
        backgroundColor: theme.fn.rgba(theme.colors[theme.primaryColor][5], 0.2),
      },
    },
  },
}));

const CustomScrollArea = ({
  scrollType,
  paneIndex,
  paneId,
  ...rest
}: ScrollAreaProps & {
  scrollType: 'vertical' | 'horizontal';
  paneIndex: number;
  paneId: string;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [paneSizes] = useSlice(app.paneManager.paneSizes);

  const size = paneSizes[scrollType][paneIndex];

  if (!size) return null;
  let total = 0;

  if (scrollType === 'horizontal') {
    for (let i = 0; i < paneSizes.horizontal.length; i += 1) {
      if (i !== paneIndex) {
        const element = paneSizes.horizontal[i];
        if (typeof element === 'number') {
          total += element;
        }
      }
    }
  }

  return (
    <Box ref={ref} sx={{ width: '100%', overflow: 'hidden' }}>
      <ScrollArea
        scrollbarSize={10}
        sx={{
          height: `calc(100vh - var(--mantine-header-height) - ${total}px - var(--titlebar-height) - var(--mantine-footer-height))`,
        }}
        {...rest}>
        {rest.children}
      </ScrollArea>
    </Box>
  );
};

const PaneItem = (props: { children: React.ReactNode; id: string; droppable: boolean }) => {
  const [isDragging] = useSlice(app.dndManager.isDragging);
  const { classes, cx } = useStyles({ isDragging });

  if (!props.droppable) {
    return (
      <SplitPaneView minSize={100}>
        <div data-pane-id={props.id}>{props.children}</div>
      </SplitPaneView>
    );
  }

  return (
    <SplitPaneView minSize={100}>
      <Droppable droppableId={`busy-pane-id:${props.id}`}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            data-pane-id={props.id}
            data-contextmenu-field="pane"
            className={cx(classes.paneBusyDropArea)}
            ref={provided.innerRef}
            {...provided.droppableProps}>
            <div
              style={{ zIndex: isDragging ? 99 : -1 }}
              className={cx('overlay', isDragging && snapshot.isDraggingOver && 'active')}
            />
            {props.children}
          </div>
        )}
      </Droppable>
    </SplitPaneView>
  );
};

function PaneView() {
  const [isDragging] = useSlice(app.dndManager.isDragging);
  const [paneSizes, setPaneSizes] = useSlice(app.paneManager.paneSizes);
  const { classes, cx } = useStyles({ isDragging });

  const [{ currentView }] = useSlice(app.viewManager.store);
  const [{ panes }] = useSlice(app.paneManager.store);

  const Component = app.viewManager.getViewComponent(currentView);

  const verticalPanes = [
    ...panes.filter(pane => pane.position === 'left'),
    { id: 'main_view', render: Component, position: 'right', size: '30%' },
    ...panes.filter(pane => pane.position === 'right'),
  ];
  const horizontalPanes = [
    ...panes.filter(pane => pane.position === 'top'),
    { id: 'main_view', render: Component, position: 'top', size: '50%' },
    ...panes.filter(pane => pane.position === 'bottom'),
  ];

  useEffect(() => {
    const verticalPaneSizes =
      paneSizes.vertical.length === verticalPanes.length
        ? paneSizes.vertical
        : verticalPanes.map(pane => pane.size || `calc(100% / ${horizontalPanes.length})`);
    const horizontalPaneSizes =
      paneSizes.horizontal.length === horizontalPanes.length
        ? paneSizes.horizontal
        : horizontalPanes.map(pane => pane.size || `calc(100% / ${horizontalPanes.length})`);

    setPaneSizes({
      horizontal: horizontalPaneSizes,
      vertical: verticalPaneSizes,
    });
  }, [panes]);

  const setPaneSize = (sizes: number[], type: 'vertical' | 'horizontal') => {
    app.paneManager.paneSizes.setKey(type, sizes);
  };

  return (
    <>
      {panes.length > 0 ? (
        <>
          <SplitPane
            split="vertical"
            sizes={paneSizes.vertical}
            sashRender={(_, active) => <SashContent active={active} type="vscode" />}
            onChange={sizes => setPaneSize(sizes, 'vertical')}>
            {verticalPanes.map((verticalPane, verticalIndex) => {
              if (verticalPane.id === 'main_view') {
                return (
                  <SplitPane
                    key={`vartical-${verticalPane.id}`}
                    split="horizontal"
                    sizes={paneSizes.horizontal}
                    sashRender={(_, active) => <SashContent active={active} type="vscode" />}
                    onChange={sizes => setPaneSize(sizes, 'horizontal')}>
                    {horizontalPanes.map((horizontalPane, horizontalIndex) => (
                      <>
                        <PaneItem
                          key={`horizontal-${horizontalPane.id}`}
                          droppable={horizontalPane.id !== 'main_view'}
                          id={horizontalPane.id}>
                          <CustomScrollArea
                            paneId={horizontalPane.id}
                            paneIndex={horizontalIndex}
                            scrollType="horizontal">
                            <DisplayRenderableNode node={horizontalPane.render} />
                          </CustomScrollArea>
                        </PaneItem>
                      </>
                    ))}
                  </SplitPane>
                );
              }

              return (
                <PaneItem
                  key={`vartical-${verticalPane.id}`}
                  droppable={verticalPane.id !== 'main_view'}
                  id={verticalPane.id}>
                  <CustomScrollArea
                    paneId={verticalPane.id}
                    paneIndex={verticalIndex}
                    scrollType="vertical">
                    <DisplayRenderableNode node={verticalPane.render} />
                  </CustomScrollArea>
                </PaneItem>
              );
            })}
          </SplitPane>
        </>
      ) : (
        <CustomScrollArea paneId="main_view" paneIndex={0} scrollType="vertical">
          <DisplayRenderableNode node={Component} />
        </CustomScrollArea>
      )}

      <Droppable droppableId="free-right-pane">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            className={cx(classes.paneFreeDropArea, classes.right)}
            ref={provided.innerRef}
            {...provided.droppableProps}>
            <div className={cx('overlay', isDragging && snapshot.isDraggingOver && 'active')} />
          </div>
        )}
      </Droppable>

      <Droppable droppableId="free-bottom-pane">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            className={cx(classes.paneFreeDropArea, classes.bottom)}
            ref={provided.innerRef}
            {...provided.droppableProps}>
            <div className={cx('overlay', isDragging && snapshot.isDraggingOver && 'active')} />
          </div>
        )}
      </Droppable>
    </>
  );
}

export function Layout() {
  const { i18n } = useTranslation();

  const [, setInterface] = useSlice(app.themeManager.interface);
  const theme = useMantineTheme();

  useEffect(() => {
    const languageController =
      app.settingsManager.getSettingController<LanguageSetting.Type>('language');
    let cleanup: () => void = () => {};

    if (languageController) {
      cleanup = languageController.instance.subscribe(({ detail }) => {
        const language = detail.value.value;
        i18n.changeLanguage(language);
        const htmlNode = Array.from(document.getElementsByTagName('html'))[0];
        htmlNode?.setAttribute('lang', language);
      });
    }

    return () => cleanup();
  }, []);

  useEffect(() => {
    setInterface(theme);
  }, [theme]);

  return (
    <AppShell
      navbar={<KasifNavbar />}
      header={<KasifHeader />}
      footer={<KasifFooter />}
      styles={() => ({
        main: {
          backgroundColor: 'transparent',
          paddingTop: 'calc(var(--mantine-header-height, 0px) + var(--titlebar-height, 0px))',
          paddingBottom: 'calc(var(--mantine-footer-height, 0px))',
          paddingLeft: 'calc(var(--mantine-navbar-width, 0px))',
          paddingRight: 'calc(var(--mantine-aside-width, 0px))',
        },
      })}>
      <div
        style={{
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        }}>
        <ContextMenu />
        <PaneView />
      </div>
    </AppShell>
  );
}

export function PageSkeleton({
  id,
  transition,
  children,
}: {
  id: string;
  children: React.ReactElement;
  transition?: MantineTransition;
}) {
  const controller = useTransitionController(50);

  useEffect(() => {
    app.viewManager.controllers.upsert(oldValue => ({
      [id]: { ...oldValue[id], view: controller },
    }));
  }, []);

  return (
    <Transition controller={controller} transition={transition || animations.scale}>
      {children}
    </Transition>
  );
}
