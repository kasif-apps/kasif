import { app } from '@kasif/config/app';
import { isExtensionRenderer } from '@kasif/managers/settings';
import { NodeRenderer } from '@kasif/util/node-renderer';
import { createStyles, Card, Group, Text, Box } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
  },

  itemMeta: {
    display: 'flex',
    alignItems: 'center',

    '&::before': {
      content: '""',
      display: 'inline-block',
      width: 6,
      height: 54,
      backgroundColor: 'var(--setting-category-color)',
      marginRight: theme.spacing.xs,
      borderRadius: theme.radius.sm,
    },
  },

  item: {
    '& + &': {
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },

    "&[data-captured='true']": {
      outline: '1px solid',
    },
  },

  title: {
    lineHeight: 1,
    marginTop: 4,
  },
}));

export function SettingsPage() {
  const { classes } = useStyles();

  const categories = app.settingsManager.categories.map((category) => {
    const items = app.settingsManager.controllers
      .filter((item) => item.category === category.id)
      .map((_item) => {
        const item = _item.instance.get();

        return (
          <Group key={item.id} position="apart" className={classes.item} noWrap spacing="xl">
            <div>
              <Text>{item.title}</Text>
              <Text size="xs" color="dimmed">
                {item.description}
              </Text>
            </div>
            {isExtensionRenderer(item.action) ? (
              <NodeRenderer node={item.action.render()} />
            ) : (
              <item.action />
            )}
          </Group>
        );
      });

    if (items.length === 0) {
      return null;
    }

    return (
      <div key={category.id}>
        <Box
          sx={(theme) => ({
            '--setting-category-color': theme.colors[category.color || 'orange'][5],
          })}
          mb="xl"
          className={classes.itemMeta}
        >
          <div>
            <Text size="md" className={classes.title} weight={600}>
              {category.title}
            </Text>
            <Text size="xs" color="dimmed" mt={3}>
              {category.description}
            </Text>
          </div>
        </Box>
        {items}
      </div>
    );
  });

  return (
    <Box p="sm" pt={0} sx={{ maxWidth: 1400, margin: 'auto' }}>
      <Card data-non-capture-source radius="md" p="xl" className={classes.card}>
        <Text size="xl" className={classes.title} weight={800}>
          Settings
        </Text>
        {categories}
      </Card>
    </Box>
  );
}
