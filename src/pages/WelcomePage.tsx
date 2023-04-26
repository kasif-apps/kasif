import { useCallback } from 'react';

import {
  Box,
  Center,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
  createStyles,
} from '@mantine/core';

import { ReactComponent as Blob } from '@kasif/assets/img/blob.svg';
import { app } from '@kasif/config/app';
import { LocaleString } from '@kasif/config/i18n';
import { DisplayRenderableNode, RenderableNode } from '@kasif/util/node-renderer';

import {
  IconCode,
  IconCoffee,
  IconFolder,
  IconPlus,
  IconPuzzle,
  IconRotateRectangle,
  IconUser,
  IconUsers,
} from '@tabler/icons';

import { PageSkeleton } from './Layout';

import { motion } from 'framer-motion';

const useStyles = createStyles(theme => ({
  bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  title: {
    color: theme.white,
    textShadow: `0 0 40px hsl(286, 100%, 68%)`,
    fontSize: 38,
    cursor: 'default',
  },
  subtitle: {
    color: theme.white,
    textShadow: `0 0 40px hsl(286, 100%, 68%)`,
    opacity: 0.6,
    fontSize: 20,
    cursor: 'default',
  },

  card: {
    borderRadius: theme.radius.md,
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 1000,
  },

  cardContent: {
    'aspectRatio': '1 / 1',
    'backgroundColor':
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors.dark[7], 0.4)
        : theme.fn.rgba(theme.colors.gray[0], 0.4),
    'width': '100%',
    'height': '100%',
    'borderRadius': theme.radius.md,
    'border': '1px solid',
    'borderColor': 'rgba(255, 255, 255, 0.05)',
    'display': 'flex',
    'position': 'relative',
    'zIndex': 999,
    'justifyContent': 'center',
    'alignItems': 'center',
    'boxShadow': theme.colorScheme === 'dark' ? 'none' : '0 0 20px rgba(0,0,0,.06)',

    '&:before': {
      background:
        'radial-gradient(80px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.08) 0%, transparent 100%)',
      content: '""',
      borderRadius: 'inherit',
      width: '100%',
      height: '100%',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      top: 0,
      left: 0,
      position: 'absolute',
      zIndex: 2,
    },

    '&:hover:before, &:focus:before, &:active:before': {
      opacity: 1,
    },
  },
}));

interface WelcomeCardProps {
  title: LocaleString;
  icon: RenderableNode;
}

function WelcomeCard(props: WelcomeCardProps) {
  const { classes } = useStyles();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const element = e.target as HTMLElement;

    const box = element.getBoundingClientRect();

    element.style.setProperty('--mouse-x', `${e.clientX - box.left}px`);
    element.style.setProperty('--mouse-y', `${e.clientY - box.top}px`);
  }, []);

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 1 }}
        className={classes.card}>
        <UnstyledButton onMouseMove={handleMouseMove} className={classes.cardContent}>
          <Stack
            sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}
            spacing="xs">
            <DisplayRenderableNode node={props.icon} />
            <Text
              sx={{
                maxWidth: '80%',
                textAlign: 'center',
                whiteSpace: 'break-spaces',
                textOverflow: 'ellipsis',
              }}
              color="dimmed"
              fw="bold"
              size="sm">
              {app.localeManager.getI18nValue(props.title)}
            </Text>
          </Stack>
        </UnstyledButton>
      </motion.div>
    </div>
  );
}

export function WelcomePage() {
  const { classes } = useStyles();

  return (
    <PageSkeleton transition="fade" id="home">
      <Box sx={{ height: '100%' }}>
        <Blob className={classes.bg} height="100%" />
        <Box
          px={100}
          py={60}
          sx={{ maxWidth: 1200, margin: 'auto', height: '100%', position: 'relative' }}>
          <Stack spacing="xl">
            <Center>
              <div>
                <Title className={classes.title}>Kâşif the Explorer.</Title>
                <Title className={classes.subtitle}>Modern, cross platform file manager</Title>
              </div>
            </Center>
            <Stack spacing="xs">
              <Text size="xs" transform="uppercase" fw="light">
                Getting Started{' '}
                <Text transform="lowercase" color="dimmed" component="span">
                  by kasif
                </Text>
              </Text>
              <SimpleGrid spacing="sm" cols={6}>
                <WelcomeCard
                  title={{ en: 'Install Plugins' }}
                  icon={() => <IconPuzzle stroke={1.5} size={32} />}
                />
                <WelcomeCard
                  title={{ en: 'Create Plugin' }}
                  icon={() => <IconPlus stroke={1.5} size={32} />}
                />
                <WelcomeCard
                  title={{ en: 'Contribute' }}
                  icon={() => <IconCode stroke={1.5} size={32} />}
                />
                <WelcomeCard
                  title={{ en: 'Support' }}
                  icon={() => <IconCoffee stroke={1.5} size={32} />}
                />
                <WelcomeCard
                  title={{ en: 'Join Community' }}
                  icon={() => <IconUsers stroke={1.5} size={32} />}
                />
                <WelcomeCard
                  title={{ en: 'Login' }}
                  icon={() => <IconUser stroke={1.5} size={32} />}
                />
              </SimpleGrid>
            </Stack>
            <Stack spacing="xs">
              <Text size="xs" transform="uppercase" fw="light">
                Recent Directories{' '}
                <Text transform="lowercase" color="dimmed" component="span">
                  by the explorer
                </Text>
              </Text>
              <SimpleGrid spacing="sm" cols={7}>
                <WelcomeCard
                  title={{ en: 'Desktop' }}
                  icon={() => <IconFolder stroke={1.5} size={32} />}
                />
                <WelcomeCard
                  title={{ en: 'Downloads' }}
                  icon={() => <IconFolder stroke={1.5} size={32} />}
                />
                <WelcomeCard
                  title={{ en: 'kasif' }}
                  icon={() => <IconFolder stroke={1.5} size={32} />}
                />
              </SimpleGrid>
            </Stack>
            <Stack spacing="xs">
              <Text size="xs" transform="uppercase" fw="light">
                Options{' '}
                <Text transform="lowercase" color="dimmed" component="span">
                  by git explorer
                </Text>
              </Text>
              <SimpleGrid spacing="sm" cols={7}>
                <WelcomeCard
                  title={{ en: 'Update' }}
                  icon={() => <IconRotateRectangle stroke={1.5} size={32} />}
                />
              </SimpleGrid>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </PageSkeleton>
  );
}
