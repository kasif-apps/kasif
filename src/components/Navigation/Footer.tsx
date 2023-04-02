import { ActionIcon, createStyles, Footer, Tooltip, Box, Group } from '@mantine/core';
import { IconLicense } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  footer: {
    left: 'var(--mantine-navbar-width)',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export function KasifFooter() {
  const { classes } = useStyles();

  return (
    <Footer className={classes.footer} height={32} px="sm">
      <Box>Hey</Box>
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
