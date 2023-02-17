import { createStyles, Header, ScrollArea } from '@mantine/core';
import { Tabs } from '@kasif/components/ViewController/Tabs';

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  },
}));

export function KasifHeader() {
  const { classes } = useStyles();

  return (
    <Header
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
