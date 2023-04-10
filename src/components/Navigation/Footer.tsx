import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import { ActionIcon, createStyles, Footer, Tooltip, Box, Group } from '@mantine/core';
import { IconLicense } from '@tabler/icons';

const useStyles = createStyles((theme, { isHomeView }: { isHomeView: boolean }) => ({
  footer: {
    left: 'var(--mantine-navbar-width)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(5px)',

    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors.dark[8], isHomeView ? 0.2 : 1)
        : theme.fn.rgba(theme.colors.gray[0], isHomeView ? 0.2 : 1),

    borderTop: `1px solid ${
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors.dark[5], isHomeView ? 0.2 : 1)
        : theme.fn.rgba(theme.colors.gray[0], isHomeView ? 0.1 : 1)
    }`,
  },
}));

export function KasifFooter() {
  const [viewStore] = useSlice(app.viewManager.store);
  const { classes } = useStyles({ isHomeView: viewStore.currentView === null });

  return (
    <Footer withBorder={false} className={classes.footer} height={32} px="sm">
      <Box />
      <Group spacing="xs">
        <Tooltip label="Licenses">
          <ActionIcon variant="transparent" size="sm" color="primary">
            <IconLicense stroke={1.5} size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Footer>
  );
}
