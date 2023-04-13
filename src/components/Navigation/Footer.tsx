import { ActionIcon, createStyles, Footer, Tooltip, Box, Group } from '@mantine/core';
import { IconLicense } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  footer: {
    left: 'var(--mantine-navbar-width)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(5px)',

    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],

    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

export function KasifFooter() {
  const { classes } = useStyles();

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
