import {
  ActionIcon,
  Box,
  Card,
  createStyles,
  Divider,
  Group,
  Input,
  Stack,
  Tooltip,
} from '@mantine/core';
import { Transition } from '@kasif/components/Transition/TransitionWrapper';
import { useSlice } from '@kasif/util/cinq-react';
import { app } from '@kasif/config/app';
import { ToolbarItem } from '@kasif/config/toolbar';

const useStyles = createStyles((theme) => ({
  card: {
    boxShadow: theme.colorScheme === 'dark' ? 'none' : theme.shadows.xs,
    minHeight: 48,
  },

  button: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
  },

  input: {
    minHeight: 28,
    height: 28,
    fontSize: 12,
  },
}));

function ToolbarItemComponent({ item }: { item: ToolbarItem }) {
  const { classes } = useStyles();

  const disabled = item.disabled?.(app);

  return (
    <Tooltip key={item.id} label={item.label}>
      <ActionIcon
        onClick={item.onClick}
        disabled={disabled}
        className={classes.button}
        variant="light"
        size="md"
      >
        <item.icon />
      </ActionIcon>
    </Tooltip>
  );
}

function getItems<T>(items: T[], predicate: (value: T, index: number, array: T[]) => unknown) {
  return items.filter(predicate).map((item) => <ToolbarItemComponent item={item as ToolbarItem} />);
}

export function Toolbar() {
  const { classes } = useStyles();
  const [items] = useSlice(app.contentManager.toolbarItems);

  return (
    <Box px="sm" py={0}>
      <Transition transition="fade">
        <Card p="xs" className={classes.card}>
          <Stack spacing="xs">
            <Group spacing="xs">
              <Group spacing="xs">
                {getItems(items, (item) => item.placement === 'navigation')}
              </Group>
              <Input classNames={{ input: classes.input }} sx={{ flex: 1, height: 28 }} />
              <Group>{getItems(items, (item) => item.placement === 'contextual')}</Group>
            </Group>
            <Divider />
            <Group sx={{ justifyContent: 'space-between' }}>
              <Group spacing="xs">{getItems(items, (item) => item.placement === 'action')}</Group>
              <Group spacing="xs">
                {getItems(items, (item) => item.placement === 'custom' && !item.predefined)}
                {getItems(items, (item) => item.placement === 'custom' && item.predefined)}
              </Group>
            </Group>
          </Stack>
        </Card>
      </Transition>
    </Box>
  );
}
