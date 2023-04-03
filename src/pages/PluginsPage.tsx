import { uploadPlugin } from '@kasif/managers/plugin';
import { Button } from '@mantine/core';
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
        uploadPlugin(path);
      });
    }
  };

  return (
    <div>
      <Button loading={loading} onClick={handleClick}>
        Load Local Plugin
      </Button>
    </div>
  );
}
