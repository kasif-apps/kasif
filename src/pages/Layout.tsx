import { KasifHeader, KasifNavbar, KasifFooter } from '@kasif/components/Navigation';
import { AppShell, ScrollArea, ScrollAreaProps } from '@mantine/core';
import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import SplitPane from 'react-split-pane';

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

export function Layout() {
  const [{ currentView }] = useSlice(app.viewManager.store);
  const [paneStore] = useSlice(app.paneManager.store);

  const Component = app.viewManager.getViewComponent(currentView);
  const panes = [{ id: '0', Component }, ...paneStore.panes];

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
        <SplitPane size="60%" split="vertical">
          {panes.map((pane) => (
            // @ts-ignore
            <CustomScrollArea>
              <pane.Component />
            </CustomScrollArea>
          ))}
        </SplitPane>
      ) : (
        <CustomScrollArea>
          <Component />
        </CustomScrollArea>
      )}
    </AppShell>
  );
}
