import React from 'react';
import { Group, UnstyledButton, Text, createStyles, Kbd, Center } from '@mantine/core';
import { SpotlightAction, SpotlightActionProps } from '@mantine/spotlight';
import { app } from '@kasif/config/app';

const useStyles = createStyles((theme) => ({
  action: {
    position: 'relative',
    display: 'block',
    width: '100%',
    padding: '4px 12px',
    borderRadius: theme.radius.sm,
  },

  actionHovered: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1],
  },
}));

export const actions: SpotlightAction[] = [];

export function ActionComponent({
  action,
  styles,
  classNames,
  hovered,
  onTrigger,
  id,
  ...others
}: SpotlightActionProps) {
  const { classes, cx } = useStyles(null as unknown as void, {
    styles,
    classNames,
    name: 'Spotlight',
  });

  const { source } = app.commandManager.commands.find((c) => c.id === action.id)!;

  return (
    <UnstyledButton
      className={cx(classes.action, { [classes.actionHovered]: hovered })}
      tabIndex={-1}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onTrigger}
      {...others}
    >
      <Group noWrap spacing="xs">
        {action.icon && <Center>{action.icon}</Center>}

        <div style={{ flex: 1 }}>
          <Group sx={{ justifyContent: 'space-between' }}>
            <Group spacing="xs" sx={{ alignItems: 'baseline' }}>
              <Text size="sm">{action.title}</Text>
              <Text size="xs" color="dimmed">
                {source.name}
              </Text>
            </Group>
            {action.shortCut && (
              <Kbd py={0} px={4}>
                {action.shortCut}
              </Kbd>
            )}
          </Group>

          {action.description && (
            <Text color="dimmed" size="xs">
              {action.description}
            </Text>
          )}
        </div>
      </Group>
    </UnstyledButton>
  );
}
