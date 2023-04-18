import { animations } from '@kasif/util/misc';
import { Card, Image, Text, Group, Badge, Button, ActionIcon, createStyles } from '@mantine/core';
import { IconHeart } from '@tabler/icons';
import { Transition } from '@kasif/components/Transition/TransitionWrapper';
import { app } from '@kasif/config/app';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'transform 0.3s ease',

    '&:hover': {
      transform: 'scale(1.02)',
    },
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },

  author: {
    cursor: 'pointer',

    '&:hover, &:focus, &:active': {
      textDecoration: 'underline',
    },
  },
}));

interface PluginCardProps {
  image: string;
  title: string;
  author: string;
  category: string[];
  description: string;
  url: string;
  installed: boolean;
}

export function PluginCard(props: PluginCardProps) {
  const { image, title, description, category, author, url, installed } = props;
  const [loading, setLoading] = useState(false);
  const { classes } = useStyles();

  return (
    <Transition transition="fade">
      <div>
        <Card radius="md" p="md" className={classes.card}>
          <Card.Section>
            <Image src={image} alt={title} height={180} />
          </Card.Section>

          <Card.Section className={classes.section} mt="md">
            <Group noWrap position="apart">
              <Text fz="lg" fw={500}>
                {title}
              </Text>
              <Text className={classes.author} size="xs" color="dimmed">
                {author}
              </Text>
            </Group>
            <Text fz="sm" mt="xs">
              {description}
            </Text>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Group noWrap spacing="xs" mt="md">
              {category.map((item) => (
                <Badge key={item} size="sm" color="teal">
                  {item}
                </Badge>
              ))}
            </Group>
          </Card.Section>

          <Group mt="xs">
            <Button
              loading={loading}
              onClick={async () => {
                if (!installed) {
                  setLoading(true);
                  await app.pluginManager.installPlugin(url);
                  setLoading(false);
                }
              }}
              radius="md"
              variant={installed ? 'outline' : 'filled'}
              style={{ flex: 1 }}
            >
              {installed ? 'Uninstall' : 'Install'}
            </Button>
            <ActionIcon variant="default" radius="md" size={36}>
              <IconHeart size="1.1rem" className={classes.like} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Card>
      </div>
    </Transition>
  );
}

const useHeroStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundImage: `linear-gradient(-60deg, ${theme.colors.blue[4]} 0%, ${theme.colors.blue[7]} 100%)`,
    padding: `calc(${theme.spacing.xl} * 1.5)`,
    borderRadius: theme.radius.md,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },

  title: {
    color: theme.white,
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: theme.fontSizes.sm,
  },

  label: {
    color: theme.colors.blue[2],
    fontSize: 12,
    lineHeight: 1,
    fontWeight: 500,
    textTransform: 'uppercase',
  },

  count: {
    color: theme.white,
    fontSize: 32,
    lineHeight: 1,
    fontWeight: 700,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  description: {
    color: theme.colors.blue[0],
    fontSize: theme.fontSizes.sm,
    marginTop: 5,
  },

  stat: {
    flex: 1,

    '& + &': {
      paddingLeft: theme.spacing.xl,
      marginLeft: theme.spacing.xl,
      borderLeft: `1px solid ${theme.colors.blue[3]}`,

      [theme.fn.smallerThan('sm')]: {
        paddingLeft: 0,
        marginLeft: 0,
        borderLeft: 0,
        paddingTop: theme.spacing.xl,
        marginTop: theme.spacing.xl,
        borderTop: `1px solid ${theme.colors.blue[3]}`,
      },
    },
  },
}));

interface HeroProps {
  data: { title: string; downloads: number; description: string; category: string[] }[];
}

export function Hero({ data }: HeroProps) {
  const { classes } = useHeroStyles();
  const stats = data.map((stat) => (
    <div key={stat.title} className={classes.stat}>
      <Text className={classes.label}>Downloads</Text>
      <Text className={classes.count}>{stat.downloads}</Text>
      <Text className={classes.title}>{stat.title}</Text>
      <Text className={classes.description}>{stat.description}</Text>
      <Group spacing={6} mt="sm">
        {stat.category.map((item) => (
          <Badge key={item} color="blue" variant="filled">
            {item}
          </Badge>
        ))}
      </Group>
    </div>
  ));

  return (
    <Transition transition={animations.scale}>
      <div className={classes.root}>{stats}</div>
    </Transition>
  );
}
