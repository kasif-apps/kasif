import { app } from '@kasif/config/app';
import { useContextMenuItems } from '@kasif/managers/contextmenu';
import { useSlice } from '@kasif/util/cinq-react';
import { createShortcutLabelFromString } from '@kasif/util/misc';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';
import { createStyles, Menu, Text } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';

const useStyles = createStyles(() => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
}));

export function ContextMenu() {
  const { classes } = useStyles();
  const [store] = useSlice(app.contextMenuManager.store);
  const items = useContextMenuItems();
  const ref = useClickOutside(() => app.contextMenuManager.closeMenu());

  if (!store.open) return null;

  return (
    <div
      ref={ref}
      style={{ top: store.position.y, left: store.position.x }}
      className={classes.root}
    >
      <Menu position="top-start" opened shadow="md" width={260}>
        <Menu.Target>
          <span />
        </Menu.Target>

        <Menu.Dropdown>
          {Array.from(items.entries()).map(([category, children]) => (
            <>
              <Menu.Label key={category.id}>{category.title}</Menu.Label>
              {children.map((item) => (
                <Menu.Item
                  key={item.id}
                  icon={item.icon ? <DisplayRenderableNode node={item.icon} /> : undefined}
                  onClick={async (e) => {
                    e.preventDefault();
                    await item.onTrigger();
                    app.contextMenuManager.closeMenu();
                  }}
                  rightSection={
                    item.shortCut ? (
                      <Text size="xs" color="dimmed">
                        {createShortcutLabelFromString(item.shortCut)}
                      </Text>
                    ) : undefined
                  }
                >
                  <Text size="sm">{item.title}</Text>
                </Menu.Item>
              ))}
            </>
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
