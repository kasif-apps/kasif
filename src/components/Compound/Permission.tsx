import { permissionDescriptions, PermissionType } from '@kasif/config/permission';
import { Stack, Text } from '@mantine/core';

export function Permission({ label, description }: { label: string; description: string }) {
  return (
    <Stack spacing={0}>
      <Text size="sm" fw="bold">
        {label}
      </Text>
      <Text size="sm">{description}</Text>
    </Stack>
  );
}

export function Permissions({ permissions }: { permissions: PermissionType[] }) {
  return (
    <Stack spacing="sm">
      {permissions.map((permission) => (
        <Permission key={permission} {...permissionDescriptions[permission]} />
      ))}

      <Text size="xs" color="dimmed">
        You can revoke any of these permissions at any time.
      </Text>
    </Stack>
  );
}
