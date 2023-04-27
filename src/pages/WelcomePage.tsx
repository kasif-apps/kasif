import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Center,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  UnstyledButton,
  createStyles,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { ReactComponent as Blob } from '@kasif/assets/img/blob.svg';
import { Transition } from '@kasif/components/Transition/TransitionWrapper';
import { app } from '@kasif/config/app';
import { ActionCard, InfoCard, WelcomeSection } from '@kasif/managers/view';
import { useSlice } from '@kasif/util/cinq-react';
import { animations } from '@kasif/util/misc';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';

import { PageSkeleton } from './Layout';

import { motion } from 'framer-motion';

const useStyles = createStyles(theme => ({
  bg: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    top: '-100%',
    left: '-60%',
  },
  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[5],
    textShadow: `0 0 30px rgba(255, 255, 255, 0.4)`,
    fontSize: 38,
    cursor: 'default',
  },
  subtitle: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.colors.dark[5],
    textShadow: `0 0 30px rgba(255, 255, 255, 0.4)`,
    opacity: 0.6,
    fontSize: 20,
    cursor: 'default',
  },

  card: {
    borderRadius: theme.radius.md,
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    position: 'relative',
    height: '100%',
    zIndex: 1000,
  },

  cardContent: {
    'backgroundColor':
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors.dark[7], 0.4)
        : theme.fn.rgba(theme.colors.gray[0], 0.6),
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
    'boxShadow': theme.colorScheme === 'dark' ? 'none' : '0 0 40px rgba(0,0,0,.04)',

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

  cardTitle: {
    maxWidth: '80%',
    textAlign: 'center',
    whiteSpace: 'break-spaces',
    textOverflow: 'ellipsis',
    fontSize: 14,

    [theme.fn.smallerThan('md')]: {
      fontSize: 12,
    },
  },

  cardDescription: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    textOverflow: 'ellipsis',
  },

  cardIcon: {
    'width': 32,
    'height': 32,

    '& svg': {
      width: 32,
      height: 32,
    },

    [theme.fn.smallerThan('sm')]: {
      'width': 20,
      'height': 20,

      '& svg': {
        width: 20,
        height: 20,
      },
    },
  },
}));

interface WelcomeItem {
  type: 'action-card' | 'info-card';
  children: React.ReactElement;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function WelcomeCard(props: WelcomeItem) {
  const { classes } = useStyles();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const element = e.target as HTMLElement;

    const box = element.getBoundingClientRect();

    element.style.setProperty('--mouse-x', `${e.clientX - box.left}px`);
    element.style.setProperty('--mouse-y', `${e.clientY - box.top}px`);
  }, []);

  return (
    <Transition transition={animations.scale}>
      <div style={{ perspective: 1000 }}>
        <motion.div
          transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          style={{ aspectRatio: props.type === 'action-card' ? '1 / 1' : '2.1 / 1' }}
          className={classes.card}>
          <UnstyledButton
            onClick={props.onClick}
            onMouseMove={handleMouseMove}
            className={classes.cardContent}>
            {props.children}
          </UnstyledButton>
        </motion.div>
      </div>
    </Transition>
  );
}

export function WelcomeActionCard(props: ActionCard) {
  const { classes } = useStyles();

  return (
    <WelcomeCard type={props.type} onClick={e => props.onClick(e.nativeEvent)}>
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }} spacing="xs">
        <span className={classes.cardIcon}>
          <DisplayRenderableNode node={props.icon} />
        </span>
        <Text className={classes.cardTitle} color="dimmed" fw="bold">
          {app.localeManager.getI18nValue(props.title)}
        </Text>
      </Stack>
    </WelcomeCard>
  );
}

export function WelcomeInfoCard(props: InfoCard) {
  const { classes } = useStyles();

  return (
    <WelcomeCard type={props.type}>
      <Group noWrap p="sm" sx={{ justifyContent: 'start', width: '100%' }}>
        <span className={classes.cardIcon}>
          <DisplayRenderableNode node={props.icon} />
        </span>
        <Stack spacing={0}>
          <Text fw="bold" size="sm">
            {app.localeManager.getI18nValue(props.title)}
          </Text>
          <Text className={classes.cardDescription} color="dimmed" size="xs">
            {app.localeManager.getI18nValue(props.description)}
          </Text>
        </Stack>
      </Group>
    </WelcomeCard>
  );
}

function WelcomeSectionDisplay(props: WelcomeSection) {
  const tablet = useMediaQuery('(max-width: 54em)');
  const mobile = useMediaQuery('(max-width: 34em)');

  if (props.items.length === 0) {
    return null;
  }

  return (
    <Stack spacing="xs">
      <Transition transition="fade">
        <Text
          // sx={{ mixBlendMode: 'color-dodge' }}
          // color="red"
          size="sm"
          transform="uppercase"
          fw="light">
          {app.localeManager.getI18nValue(props.title)}{' '}
          <Text size="xs" transform="lowercase" color="dimmed" component="span">
            by {props.by}
          </Text>
        </Text>
      </Transition>
      <Grid gutter="xs">
        {props.items.map(item => {
          if (item.type === 'action-card') {
            return (
              <Grid.Col span={mobile ? 6 : tablet ? 3 : 2}>
                <WelcomeActionCard {...item} key={item.id} />
              </Grid.Col>
            );
          }

          return (
            <Grid.Col span={mobile ? 12 : tablet ? 6 : 4}>
              <WelcomeInfoCard {...item} key={item.id} />
            </Grid.Col>
          );
        })}
      </Grid>
    </Stack>
  );
}

export function WelcomePage() {
  const { classes } = useStyles();
  const [sections] = useSlice(app.viewManager.welcomeSections);
  const { t } = useTranslation();
  const tablet = useMediaQuery('(max-width: 54em)');

  return (
    <PageSkeleton transition="fade" id="home">
      <Box sx={{ height: '100%' }}>
        <Blob className={classes.bg} height="100%" />
        <Box
          px={tablet ? 40 : 90}
          py={60}
          sx={{ maxWidth: 1200, margin: 'auto', height: '100%', position: 'relative' }}>
          <Stack spacing="xl">
            <Center>
              <div>
                <Title className={classes.title}>{t('welcome.title')}</Title>
                <Title className={classes.subtitle}>{t('welcome.subtitle')}</Title>
              </div>
            </Center>
            {Object.entries(sections).map(([key, section]) => (
              <WelcomeSectionDisplay
                key={key}
                id={section.id}
                gridSize={key === 'kasif' ? 6 : 7}
                title={section.title}
                by={section.by}
                items={section.items}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </PageSkeleton>
  );
}
