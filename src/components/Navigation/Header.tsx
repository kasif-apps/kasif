import { createStyles, Header, ScrollArea } from '@mantine/core';
import { Tabs } from '@kasif/components/ViewController/Tabs';
import { environment } from '@kasif/util/environment';

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  titlebar: {
    position: 'fixed',
    width: '100vw',
    height: 'var(--titlebar-height)',
    top: 0,
    left: 0,
    userSelect: 'none',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },
}));

export function KasifHeader() {
  const { classes } = useStyles();

  return (
    <Header
      data-contextmenu-field="view-handle-bar"
      className={classes.header}
      withBorder={false}
      sx={{ left: 'var(--mantine-navbar-width)', top: 'var(--titlebar-height)' }}
      height={60}
      p="sm"
    >
      {environment.currentEnvironment === 'desktop' && (
        <div data-tauri-drag-region className={classes.titlebar} />
      )}
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
