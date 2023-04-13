import { app } from '@kasif/config/app';
import { Box, Button } from '@mantine/core';
import { open } from '@tauri-apps/api/dialog';
import { useState } from 'react';

export function PluginsPage() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    let selected = await open({
      multiple: true,
      filters: [
        {
          name: 'Plugin',
          extensions: ['kasif'],
        },
      ],
    });

    setLoading(false);

    if (typeof selected === 'string') {
      selected = [selected];
    }

    if (selected) {
      selected.forEach((path) => {
        app.pluginManager.uploadPlugin(path);
      });
    }
  };

  return (
    <Box p="sm" sx={{ margin: 'auto', height: '100%' }}>
      <Button loading={loading} onClick={handleClick}>
        Load Local Plugin
      </Button>
    </Box>
  );
}
