import { useTranslation } from 'react-i18next';

import { Box, Card, Group, Text, createStyles } from '@mantine/core';

import { app } from '@kasif/config/app';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';

import { PageSkeleton } from './Layout';

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
  },

  itemMeta: {
    'display': 'flex',
    'alignItems': 'center',

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
  const { t } = useTranslation();

  const categories = app.settingsManager.categories.map(category => {
    const items = app.settingsManager.controllers
      .filter(item => item.category === category.id)
      .map(_item => {
        const item = _item.instance.get();

        return (
          <Group key={item.id} position="apart" className={classes.item} noWrap spacing="xl">
            <div>
              <Text>{app.localeManager.getI18nValue(item.title)}</Text>
              <Text size="xs" color="dimmed">
                {app.localeManager.getI18nValue(item.description)}
              </Text>
            </div>
            <DisplayRenderableNode node={item.render} />
          </Group>
        );
      });

    if (items.length === 0) {
      return null;
    }

    return (
      <div key={category.id}>
        <Box
          sx={theme => ({
            '--setting-category-color': theme.colors[category.color || 'orange'][5],
          })}
          mb="xl"
          className={classes.itemMeta}>
          <div>
            <Text size="md" className={classes.title} weight={600}>
              {app.localeManager.getI18nValue(category.title)}
            </Text>
            <Text size="xs" color="dimmed" mt={3}>
              {app.localeManager.getI18nValue(category.description)}
            </Text>
          </div>
        </Box>
        {items}
      </div>
    );
  });

  return (
    <PageSkeleton id="settings">
      <Box p="sm" sx={{ maxWidth: 1200, margin: 'auto' }}>
        <Card data-non-capture-source radius="md" p="xl" className={classes.card}>
          <Text size="xl" className={classes.title} weight={800}>
            {t('title.settings')}
          </Text>
          {categories}
        </Card>
      </Box>
    </PageSkeleton>
  );
}
