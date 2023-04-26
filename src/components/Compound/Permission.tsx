import { Stack, Text } from '@mantine/core';

import { app } from '@kasif/config/app';
import { LocaleString } from '@kasif/config/i18n';
import { PermissionType, getPermissionDescriptions } from '@kasif/config/permission';

export function Permission({
  label,
  description,
}: {
  label: LocaleString;
  description: LocaleString;
}) {
  return (
    <Stack spacing={0}>
      <Text size="sm" fw="bold">
        {app.localeManager.getI18nValue(label)}
      </Text>
      <Text size="sm">{app.localeManager.getI18nValue(description)}</Text>
    </Stack>
  );
}

export function Permissions({ permissions }: { permissions: PermissionType[] }) {
  const permissionDescriptions = getPermissionDescriptions(app);

  return (
    <Stack spacing="sm">
      {permissions.map(permission => (
        <Permission key={permission} {...permissionDescriptions[permission]} />
      ))}

      <Text size="xs" color="dimmed">
        You can revoke any of these permissions at any time.
      </Text>
    </Stack>
  );
}
