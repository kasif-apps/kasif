import { app } from '@kasif/config/app';
import { backend } from '@kasif/config/backend';
import { useSlice } from '@kasif/util/cinq-react';
import { Button } from '@mantine/core';
import { useState } from 'react';

export function StorePage() {
  const [user] = useSlice(app.authManager.getUserSlice());
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await backend.collection('users').authWithPassword('m.ali.can@kasif.app', '1234567890');
    setLoading(false);
  };

  const handleLogout = () => {
    backend.authStore.clear();
  };

  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <div>
        {user ? (
          <Button loading={loading} onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button loading={loading} onClick={handleLogin}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
}
