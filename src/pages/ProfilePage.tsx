import { Box, Group } from '@mantine/core';

import { SignInLogin, UserCard } from '@kasif/components/Compound/Auth';
import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';

import { PageSkeleton } from './Layout';

export function ProfilePage() {
  const [user] = useSlice(app.authManager.getUserSlice());
  const [avatar] = useSlice(app.authManager.avatar);

  if (!user) return <SignInLogin />;

  return (
    <PageSkeleton id="profile">
      <Box p="sm" sx={{ margin: 'auto', height: '100%' }}>
        <Group sx={{ height: '100%', width: '100%', alignItems: 'start' }}>
          <UserCard avatar={avatar} name={user.displayName} title={user.data.email} />
        </Group>
      </Box>
    </PageSkeleton>
  );
}
