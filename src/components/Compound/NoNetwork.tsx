import { Stack, Text } from '@mantine/core';

import { ReactComponent as NoNetworkImage } from '@kasif/assets/img/no-network.svg';
import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';

export function NoNetwork() {
  return (
    <Stack spacing={0} sx={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}>
      <Text size={26}>It seems like you are offline</Text>
      <Text color="dimmed">Go online to see this page</Text>
      <NoNetworkImage height={300} />
    </Stack>
  );
}

export function useNetworkGuard() {
  const [network] = useSlice(app.networkManager.store);

  if (!network.online) {
    return <NoNetwork />;
  }
}
