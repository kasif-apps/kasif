import React, { useEffect } from 'react';
import { KasifHeader, KasifNavbar, KasifFooter } from '@kasif/components/Navigation';
import {
  AppShell,
  createStyles,
  ScrollArea,
  ScrollAreaProps,
  useMantineTheme,
} from '@mantine/core';
import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import SplitPane from 'react-split-pane';
import { Pane } from '@kasif/managers/pane';
import { useHover } from '@mantine/hooks';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';
import { ContextMenu } from '@kasif/components/Compound/ContextMenu';
import { LanguageSetting } from '@kasif/config/settings';
import { useTranslation } from 'react-i18next';

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
}));

const CustomScrollArea = (props: ScrollAreaProps) => (
  <ScrollArea
    scrollbarSize={10}
    sx={{
      height:
        'calc(100vh - var(--mantine-header-height) - var(--titlebar-height) - var(--mantine-footer-height))',
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
          data-pane-id={props.id}
          data-contextmenu-field="pane"
          className={cx(classes.paneBusyDropArea)}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div
            style={{ zIndex: isDragging ? 99 : -1 }}
            ref={paneDropAreaRef}
            className={cx('overlay', isDragging && hovered && 'active')}
          />
          {props.children}
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

  const { i18n } = useTranslation();

  const Component = app.viewManager.getViewComponent(currentView);
  const panes: Pane[] = [{ id: '0', render: Component }, ...paneStore.panes];

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

  const getPaneSize = (size: number | undefined) => {
    if (size) {
      return `${size}px`;
    }

    return '50%';
  };

  return (
    <AppShell
      navbar={<KasifNavbar />}
      header={<KasifHeader />}
      footer={<KasifFooter />}
      styles={(them) => ({
        main: {
          backgroundColor: them.colorScheme === 'dark' ? them.colors.dark[8] : them.colors.gray[0],
          paddingTop: 'calc(var(--mantine-header-height, 0px) + var(--titlebar-height, 0px))',
          paddingBottom: 'calc(var(--mantine-footer-height, 0px))',
          paddingLeft: 'calc(var(--mantine-navbar-width, 0px))',
          paddingRight: 'calc(var(--mantine-aside-width, 0px))',
        },
      })}
    >
      <ContextMenu />
      {panes.length > 1 ? (
        // @ts-ignore
        <SplitPane size={`calc(100% - ${getPaneSize(panes[1]?.width)})`} split="vertical">
          {panes.map((pane, index) => (
            <PaneItem droppable={index !== 0} id={pane.id} key={pane.id}>
              <CustomScrollArea>
                <DisplayRenderableNode node={pane.render} />
              </CustomScrollArea>
            </PaneItem>
          ))}
        </SplitPane>
      ) : (
        <CustomScrollArea>
          <DisplayRenderableNode node={Component} />
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
