import { Group, Menu } from '@mantine/core';

export function ContextMenu() {
  return (
    <Group position="center">
      <Menu>
        <Menu.Target>
          <span>context menu target</span>
          {/* <UserButton
            image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            name="Harriette Spoonlicker"
            email="hspoonlicker@outlook.com"
          /> */}
        </Menu.Target>
        <Menu.Dropdown sx={{ minWidth: 200, maxWidth: 400 }}>
          <Menu.Item>Search</Menu.Item>
          <Menu.Item>Search</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
