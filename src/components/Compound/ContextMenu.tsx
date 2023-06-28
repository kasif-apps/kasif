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
import { createShortcutLabelFromString, useDefaultRadius } from '@kasif/util/misc';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';

import { IconChevronRight } from '@tabler/icons';

import { Transition } from '../Transition/TransitionWrapper';

const useStyles = createStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99999,
  },

  item: {
    'padding': '4px 6px',
    'background': 'transparent',

    '&:hover': {
      background:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors.dark[5], 0.4)
          : theme.fn.rgba(theme.colors.gray[1], 0.4),
    },
  },

  label: {
    padding: '2px 6px',
    fontSize: 10,
  },

  shortCut: {
    fontSize: 10,
  },

  dropdown: {
    'backgroundColor': 'transparent',
    'border': 'none',

    '& .overlay': {
      width: '100%',
      borderRadius: useDefaultRadius(),
      height: '100%',
      position: 'absolute',
      zIndex: -1,
      top: 0,
      left: 0,
      backdropFilter: 'blur(10px)',
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors.dark[7], 0.7)
          : theme.fn.rgba(theme.white, 0.7),
    },
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
      <Text size="xs">{app.localeManager.getI18nValue(item.title)}</Text>
    </Menu.Item>
  );
}

export function RenderParent({ item }: { item: ContextMenuParent }) {
  const { classes } = useStyles();

  return (
    <Menu
      classNames={{ item: classes.item, label: classes.label, dropdown: classes.dropdown }}
      id={item.id}
      trigger="hover"
      position="right-start"
      shadow="md"
      width={220}>
      <Menu.Target>
        <Menu.Item
          icon={item.icon ? <DisplayRenderableNode node={item.icon} /> : undefined}
          rightSection={<IconChevronRight size={14} />}>
          <Text size="xs">{app.localeManager.getI18nValue(item.title)}</Text>
        </Menu.Item>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{app.localeManager.getI18nValue(item.title)}</Menu.Label>
        {item.children.map(child =>
          isContextMenuParent(child) ? (
            <RenderParent key={child.id} item={child} />
          ) : (
            <RenderChild key={child.id} item={child} />
          )
        )}
        <div className="overlay" />
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
      <Transition duration={100} transition="pop-top-left">
        <div>
          <Menu
            id="context-menu"
            classNames={{ item: classes.item, label: classes.label, dropdown: classes.dropdown }}
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
                  <Menu.Label>{app.localeManager.getI18nValue(category.title)}</Menu.Label>
                  {children.map(item =>
                    isContextMenuParent(item) ? (
                      <RenderParent key={item.id} item={item} />
                    ) : (
                      <RenderChild key={item.id} item={item} />
                    )
                  )}
                </span>
              ))}
              <div className="overlay" />
            </Menu.Dropdown>
          </Menu>
        </div>
      </Transition>
    </div>
  );
}
