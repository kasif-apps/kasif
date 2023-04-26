import { useState } from 'react';

import { Box, Button } from '@mantine/core';

import { app } from '@kasif/config/app';
import { environment } from '@kasif/util/environment';

import { PageSkeleton } from './Layout';

export function PluginsPage() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    let selected = await environment.dialog.open({
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
      selected.forEach(path => {
        app.pluginManager.uploadPlugin(path);
      });
    }
  };

  return (
    <PageSkeleton id="plugins">
      <Box p="sm" sx={{ margin: 'auto', height: '100%' }}>
        <Button loading={loading} onClick={handleClick}>
          Load Local Plugin
        </Button>
      </Box>
    </PageSkeleton>
  );
}
