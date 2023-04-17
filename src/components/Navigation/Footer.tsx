import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import { ActionIcon, Text, createStyles, Footer, Tooltip, Group } from '@mantine/core';
import { IconLicense } from '@tabler/icons';

const useStyles = createStyles((theme, { isDebug }: { isDebug: boolean }) => {
  let backgroundColor: string;
  let borderColor: string;
  let color: string;

  if (isDebug) {
    [, , , , backgroundColor] = theme.colors.blue;
    [, , , , borderColor] = theme.colors.blue;
    color = theme.white;
  } else {
    backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0];
    borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2];
    color = 'inherit';
  }

  return {
    footer: {
      left: 'var(--mantine-navbar-width)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backdropFilter: 'blur(5px)',
      borderTop: `1px solid ${borderColor}`,
      color,
      backgroundColor,
    },
  };
});

export function KasifFooter() {
  const [flags] = useSlice(app.flags);
  const { classes } = useStyles({ isDebug: flags.debug });

  return (
    <Footer withBorder={false} className={classes.footer} height={32} px="sm">
      <Group>
        {flags.debug && (
          <Text fw="bolder" size="xs">
            DEBUG
          </Text>
        )}
        <Text size="xs">© 2023 Kasif</Text>
      </Group>
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
