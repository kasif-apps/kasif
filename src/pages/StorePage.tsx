import { useNetworkGuard } from '@kasif/components/Compound/NoNetwork';
import { Hero, PluginCard } from '@kasif/components/Compound/PluginCard';
import { app } from '@kasif/config/app';
import { PluginDTO } from '@kasif/managers/plugin';
import { Box, LoadingOverlay, SimpleGrid, Stack, Title } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export function StorePage() {
  const [packages, setPackages] = useState<PluginDTO[] | null>(null);
  const [popular, setPopular] = useState<PluginDTO[] | null>(null);
  const { ref, width } = useElementSize();

  useEffect(() => {
    app.pluginManager.getPopular().then((popularItems: PluginDTO[]) => {
      setPopular(popularItems);

      app.pluginManager.list().then((items: PluginDTO[]) => {
        setPackages(items);
      });
    });
  }, []);

  const guard = useNetworkGuard();
  if (guard) return guard;

  const getColumnCount = (w: number) => {
    if (w > 800) return 3;
    if (w > 560) return 2;
    return 1;
  };

  const columnCount = width === 0 ? 3 : getColumnCount(width);

  if (!packages || !popular) {
    return (
      <LoadingOverlay
        overlayOpacity={0}
        overlayColor="transparent"
        loaderProps={{ variant: 'dots' }}
        visible
      />
    );
  }

  return (
    <div ref={ref}>
      <Box p="sm" sx={{ maxWidth: 1200, margin: 'auto' }}>
        <Stack>
          <Title>Popular</Title>
          <Hero data={popular} />
          <Title>Discover</Title>
          <SimpleGrid cols={columnCount}>
            {packages.map((item) => (
              <PluginCard
                key={item.id}
                // author={item.author.username}
                author=""
                title={item.title}
                description={item.description}
                image={item.image}
                category={item.category}
                url={item.package}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </div>
  );
}
