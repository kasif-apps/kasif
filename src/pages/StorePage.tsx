import { Hero, PluginCard } from '@kasif/components/Compound/PluginCard';
import { PluginDTO, plugins } from '@kasif/managers/plugin';
import { Box, SimpleGrid, Stack, Title } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export function StorePage() {
  const [packages, setPackages] = useState<PluginDTO[] | null>(null);
  const [popular, setPopular] = useState<PluginDTO[] | null>(null);
  const { ref, width } = useElementSize();

  useEffect(() => {
    plugins.getPopular().then((popularItems: PluginDTO[]) => {
      setPopular(popularItems);

      plugins.list().then((items: PluginDTO[]) => {
        setPackages(items);
      });
    });
  }, []);

  const getColumnCount = (w: number) => {
    if (w > 800) return 3;
    if (w > 560) return 2;
    return 1;
  };

  const columnCount = width === 0 ? 3 : getColumnCount(width);

  if (!packages || !popular) return <div>Loading...</div>;

  return (
    <div ref={ref}>
      <Box p="sm" pt={0} sx={{ maxWidth: 1200, margin: 'auto' }}>
        <Stack>
          <Title>Popular</Title>
          <Hero data={popular} />
          <Title>Discover</Title>
          <SimpleGrid cols={columnCount}>
            {packages.map((item) => (
              <PluginCard
                key={item.id}
                author={item.author.username}
                title={item.title}
                description={item.description}
                image={item.image}
                category={item.category}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </div>
  );
}
