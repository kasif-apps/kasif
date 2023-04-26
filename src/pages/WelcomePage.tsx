import { Box } from '@mantine/core';

import { PageSkeleton } from './Layout';

export function WelcomePage() {
  return (
    <PageSkeleton id="home">
      <Box p="sm" sx={{ maxWidth: 1200, margin: 'auto', height: '100%' }}>
        Welcome
      </Box>
    </PageSkeleton>
  );
}
