import { Menu, Text, createStyles } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';

import { app } from '@kasif/config/app';
import {
  ContextMenuItem,
  ContextMenuParent,
  isContextMenuParent,
  useContextMenuItems,
} from '@kasif/managers/contextmenu';
import { useSlice } from '@kasif/util/cinq-react';
import { createShortcutLabelFromString } from '@kasif/util/misc';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';

import { IconChevronRight } from '@tabler/icons';

const useStyles = createStyles(() => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99999,
  },

  item: {
    padding: '4px 6px',
  },

  label: {
    padding: '2px 6px',
    fontSize: 10,
  },

  shortCut: {
    fontSize: 10,
  },
}));

export function RenderChild({ item }: { item: ContextMenuItem }) {
  const { classes } = useStyles();

  return (
    <Menu.Item
      icon={item.icon ? <DisplayRenderableNode node={item.icon} /> : undefined}
      onClick={async e => {
        e.preventDefault();
        await item.onTrigger();
        app.contextMenuManager.closeMenu();
      }}
      rightSection={
        item.shortCut ? (
          <Text className={classes.shortCut} color="dimmed">
            {createShortcutLabelFromString(item.shortCut)}
          </Text>
        ) : undefined
      }>
      <Text size="xs">{item.title}</Text>
    </Menu.Item>
  );
}

export function RenderParent({ item }: { item: ContextMenuParent }) {
  const { classes } = useStyles();

  return (
    <Menu
      classNames={{ item: classes.item, label: classes.label }}
      id={item.id}
      trigger="hover"
      position="right-start"
      shadow="md"
      width={220}>
      <Menu.Target>
        <Menu.Item
          icon={item.icon ? <DisplayRenderableNode node={item.icon} /> : undefined}
          rightSection={<IconChevronRight size={14} />}>
          <Text size="xs">{item.title}</Text>
        </Menu.Item>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{item.title}</Menu.Label>
        {item.children.map(child =>
          isContextMenuParent(child) ? (
            <RenderParent key={child.id} item={child} />
          ) : (
            <RenderChild key={child.id} item={child} />
          )
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export function ContextMenu() {
  const { classes } = useStyles();
  const [store] = useSlice(app.contextMenuManager.store);
  const items = useContextMenuItems();
  const ref = useClickOutside(() => app.contextMenuManager.closeMenu());

  if (!store.open) return null;

  const entries = Array.from(items.entries()).sort((a, b) => a[0].order - b[0].order);

  return (
    <div
      ref={ref}
      style={{ top: store.position.y, left: store.position.x }}
      className={classes.root}>
      <Menu
        id="context-menu"
        classNames={{ item: classes.item, label: classes.label }}
        position="bottom-start"
        opened
        shadow="md"
        width={220}>
        <Menu.Target>
          <span />
        </Menu.Target>

        <Menu.Dropdown>
          {entries.map(([category, children]) => (
            <span key={category.id}>
              <Menu.Label>{category.title}</Menu.Label>
              {children.map(item =>
                isContextMenuParent(item) ? (
                  <RenderParent key={item.id} item={item} />
                ) : (
                  <RenderChild key={item.id} item={item} />
                )
              )}
            </span>
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
