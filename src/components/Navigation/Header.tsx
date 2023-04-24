import { useEffect, useRef } from 'react';

import { Group, Header, Image, ScrollArea, createStyles } from '@mantine/core';

import { Tabs } from '@kasif/components/ViewController/Tabs';
import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import { environment } from '@kasif/util/environment';
import { getOS } from '@kasif/util/misc';

const useStyles = createStyles(theme => ({
  header: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
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
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

export function KasifHeader() {
  const { classes } = useStyles();
  const ref = useRef<HTMLDivElement>(null);
  const os = getOS();

  useEffect(() => {
    if (ref.current) {
      const area = ref.current.querySelector('[data-radix-scroll-area-viewport]');

      if (area) {
        area.setAttribute('data-tauri-drag-region', 'true');
      }
    }
  }, []);

  return (
    <Header
      data-tauri-drag-region={os === 'macos'}
      data-contextmenu-field="view-handle-bar"
      className={classes.header}
      withBorder={false}
      sx={{
        left: 'var(--mantine-navbar-width)',
        top: 'var(--titlebar-height)',
        width: 'calc(100vw - var(--mantine-navbar-width))',
      }}
      height={60}
      p="sm">
      {environment.currentEnvironment === 'desktop' && os !== 'macos' && (
        <div data-tauri-drag-region className={classes.titlebar} />
      )}
      <Group>
        <ScrollArea
          ref={ref}
          data-tauri-drag-region
          offsetScrollbars
          scrollbarSize={8}
          sx={{ width: 'calc(100vw - var(--mantine-navbar-width) - 80px)', minHeight: 44 }}>
          <Tabs />
        </ScrollArea>
        <Image mb={6} height={30} width={30} src="/favicon.png" alt="kasif logo" />
      </Group>
    </Header>
  );
}
