import React from 'react';
import { getIcon } from '@kasif/util/icon';
import { Group, UnstyledButton, Badge, Text, createStyles, Kbd, Center } from '@mantine/core';
import { SpotlightAction, SpotlightActionProps } from '@mantine/spotlight';

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

export const actions: SpotlightAction[] = [
  {
    title: 'Splash.tsx',
    description: '/Users/muhammedalican/Documents/repos/kasif/src/pages/Splash.tsx',
    icon: React.createElement(await getIcon('Splash.tsx', 'file'), { width: 28 }),
    group: 'Files & Folders',
    onTrigger: () => {},
  },
  {
    title: 'Kasif',
    description: '/Users/muhammedalican/Documents/repos/kasif/',
    icon: React.createElement(await getIcon('kasif', 'folder'), { width: 28 }),
    group: 'Files & Folders',
    onTrigger: () => {},
  },
  {
    title: '.editorconfig',
    description: '/Users/muhammedalican/Documents/repos/kasif/.editorconfig',
    icon: React.createElement(await getIcon('.editorconfig', 'file'), { width: 28 }),
    group: 'Files & Folders',
    onTrigger: () => {},
  },
];

export function ActionComponent({
  action,
  styles,
  classNames,
  hovered,
  onTrigger,
  ...others
}: SpotlightActionProps) {
  const { classes, cx } = useStyles(null as unknown as void, {
    styles,
    classNames,
    name: 'Spotlight',
  });

  return (
    <UnstyledButton
      className={cx(classes.action, { [classes.actionHovered]: hovered })}
      tabIndex={-1}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onTrigger}
      {...others}
    >
      <Group noWrap>
        {action.icon && <Center>{action.icon}</Center>}

        <div style={{ flex: 1 }}>
          <Group sx={{ justifyContent: 'space-between' }}>
            <Text size="sm">{action.title}</Text>
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

        {action.new && <Badge>new</Badge>}
      </Group>
    </UnstyledButton>
  );
}
