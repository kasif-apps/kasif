import { app } from '@kasif/config/app';
import { prebuiltViews } from '@kasif/config/view';
import { ReactComponent as Folder } from '@kasif/assets/icons/folder.svg';
import {
  Avatar,
  Button,
  Card,
  createStyles,
  Group,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowNarrowRight,
  IconBrandDiscord,
  IconBrandGithub,
  IconClock,
  IconCoffee,
  IconHeart,
  IconPinned,
  IconShoppingBag,
} from '@tabler/icons';
import {
  Transition,
  useTransitionController,
} from '@kasif/components/Transition/TransitionWrapper';
import { animations } from '@kasif/util/misc';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    display: 'flex',
    flexDirection: 'column',
    gap: 36,
    transition: 'transform 200ms ease-in-out, opacity 80ms ease-in-out',
  },

  title: {
    lineHeight: 1,
    marginTop: 4,
  },

  quickItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    width: 92,
    height: 92,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    transition: 'transform 200ms ease-out',

    '&:hover': {
      transform: 'scale(1.06)',
    },
  },

  dismiss: {
    marginBottom: -34,

    '& > *': {
      display: 'inline',

      '&:hover': {
        color: theme.colors.blue[5],
        cursor: 'pointer',
      },
    },
  },

  note: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 },
}));

function CtaText({ children }: { children: React.ReactNode }) {
  return (
    <Text
      size="lg"
      sx={(theme) => ({
        color: theme.colors[theme.primaryColor][5],
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
      })}
      weight={600}
    >
      <span>{children}</span>
      <IconArrowNarrowRight size={26} stroke={2} />
    </Text>
  );
}

function QuickItem() {
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.quickItem}>
      <Folder height={36} />
      <Text color="dimmed" size="xs">
        kasif
      </Text>
    </UnstyledButton>
  );
}

export function WelcomePage() {
  const { classes } = useStyles();
  const mantineTheme = useMantineTheme();
  const controller = useTransitionController(100);

  return (
    <Stack p="sm" spacing="sm" pt={0} sx={{ maxWidth: 1400, margin: 'auto', height: '100%' }}>
      <Transition transition="fade">
        <Card radius="md" p="xl" className={classes.card}>
          <Stack>
            <CtaText>Get Started</CtaText>
            <Stack spacing="lg">
              <Stack spacing={4}>
                <Group spacing={4}>
                  <IconPinned
                    size={14}
                    color={
                      mantineTheme.colorScheme === 'dark'
                        ? mantineTheme.colors.dark[2]
                        : mantineTheme.colors.gray[6]
                    }
                  />
                  <Text size="xs" color="dimmed">
                    Pinned
                  </Text>
                </Group>
                <Group spacing="xs">
                  <QuickItem />
                  <QuickItem />
                  <QuickItem />
                </Group>
              </Stack>
              <Stack spacing={4}>
                <Group spacing={4}>
                  <IconClock
                    size={14}
                    color={
                      mantineTheme.colorScheme === 'dark'
                        ? mantineTheme.colors.dark[2]
                        : mantineTheme.colors.gray[6]
                    }
                  />
                  <Text size="xs" color="dimmed">
                    Recent
                  </Text>
                </Group>
                <Group spacing="xs">
                  <QuickItem />
                  <QuickItem />
                  <QuickItem />
                  <QuickItem />
                  <QuickItem />
                  <QuickItem />
                </Group>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Transition>
      <Transition controller={controller} transition={animations.scale}>
        <Card radius="md" p="xl" className={classes.card}>
          <div className={classes.dismiss}>
            <Text onClick={() => controller.unMount()} role="button" size="xs" color="dimmed">
              Dismiss
            </Text>
          </div>
          <Stack>
            <CtaText>Discover</CtaText>
            <Text size="sm" color="dimmed">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, corporis, dolorem
              commodi sequi.
            </Text>
            <Group>
              <Button
                variant="light"
                leftIcon={<IconShoppingBag stroke={1.5} size={20} />}
                onClick={() => app.viewManager.pushView(prebuiltViews.store)}
              >
                Go To The Store
              </Button>
            </Group>
          </Stack>
          <Stack>
            <CtaText>Community</CtaText>
            <Text size="sm" color="dimmed">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, corporis, dolorem
              commodi sequi velit quam nisi enim blanditiis optio sed delectus dicta omnis inventore
              labore, fugiat iusto mollitia odit fuga.
            </Text>
            <Avatar.Group spacing="md">
              <Tooltip label="Name">
                <Avatar size="lg" src="https://picsum.photos/200" radius="xl" />
              </Tooltip>
              <Tooltip label="Name">
                <Avatar size="lg" src="https://picsum.photos/200" radius="xl" />
              </Tooltip>
              <Tooltip label="Name">
                <Avatar size="lg" src="https://picsum.photos/200" radius="xl" />
              </Tooltip>
              <Tooltip label="Name">
                <Avatar size="lg" src="https://picsum.photos/200" radius="xl" />
              </Tooltip>
              <Tooltip label="Name">
                <Avatar size="lg" src="https://picsum.photos/200" radius="xl" />
              </Tooltip>
            </Avatar.Group>
            <Group>
              <Button
                leftIcon={<IconBrandDiscord stroke={1.5} size={20} />}
                sx={(theme) => ({
                  backgroundColor: theme.colorScheme === 'dark' ? '#5865F2' : '#5865F2',
                  '&:hover': {
                    backgroundColor:
                      theme.colorScheme === 'dark'
                        ? theme.fn.lighten('#5865F2', 0.05)
                        : theme.fn.darken('#5865F2', 0.05),
                  },
                })}
              >
                Join Our Discord Server
              </Button>
              <Button
                leftIcon={<IconBrandGithub stroke={1.5} size={20} />}
                sx={(theme) => ({
                  backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                  },
                })}
              >
                See Us On Github
              </Button>
            </Group>
          </Stack>
          <Stack>
            <CtaText>Help</CtaText>
            <Text size="sm" color="dimmed">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, corporis, dolorem
              commodi sequi.
            </Text>
            <Group>
              <Button
                leftIcon={<IconBrandGithub stroke={1.5} size={20} />}
                sx={(theme) => ({
                  backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                  },
                })}
              >
                Contribute
              </Button>
              <Button leftIcon={<IconCoffee stroke={1.5} size={20} />}>Donate</Button>
            </Group>
          </Stack>
          <Text mt="xl" size="xs" color="dimmed" className={classes.note}>
            Made with <IconHeart fill="red" color="red" size={18} /> in İstanbul
          </Text>
        </Card>
      </Transition>
    </Stack>
  );
}
