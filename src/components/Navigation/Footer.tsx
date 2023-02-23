import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import { ActionIcon, createStyles, Footer, Tooltip, Text, Box, Group } from '@mantine/core';
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
  const [selection] = useSlice(app.contentManager.selection);

  return (
    <Footer className={classes.footer} height={32} px="sm">
      <Box>
        {selection.length > 0 && (
          <Text color="dimmed" size="xs">
            {selection.length} Selected
          </Text>
        )}
      </Box>
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
