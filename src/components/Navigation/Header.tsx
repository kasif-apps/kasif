import { createStyles, Header, ScrollArea } from '@mantine/core';
import { Tabs } from '@kasif/components/ViewController/Tabs';
import { useSlice } from '@kasif/util/cinq-react';
import { app } from '@kasif/config/app';

const useStyles = createStyles((theme, { isHomeView }: { isHomeView: boolean }) => ({
  header: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors.dark[8], isHomeView ? 0.2 : 1)
        : theme.fn.rgba(theme.colors.gray[0], isHomeView ? 0.2 : 1),

    backdropFilter: 'blur(5px)',
  },
}));

export function KasifHeader() {
  const [viewStore] = useSlice(app.viewManager.store);
  const { classes } = useStyles({ isHomeView: viewStore.currentView === null });

  return (
    <Header
      data-contextmenu-field="view-handle-bar"
      className={classes.header}
      withBorder={false}
      sx={{ left: 'var(--mantine-navbar-width)' }}
      height={60}
      p="sm"
    >
      <ScrollArea
        offsetScrollbars
        scrollbarSize={8}
        sx={{ width: 'calc(100vw - var(--mantine-navbar-width))' }}
      >
        <Tabs />
      </ScrollArea>
    </Header>
  );
}
