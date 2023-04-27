import {
  Box,
  Divider,
  Navbar,
  ScrollArea,
  Stack,
  Tooltip,
  UnstyledButton,
  createStyles,
} from '@mantine/core';

import { Transition } from '@kasif/components/Transition/TransitionWrapper';
import { app } from '@kasif/config/app';
import { NavbarItem } from '@kasif/managers/navbar';
import { useSlice } from '@kasif/util/cinq-react';
import { environment } from '@kasif/util/environment';
import { animations, getOS } from '@kasif/util/misc';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';

import { motion } from 'framer-motion';

const useStyles = createStyles(theme => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    backdropFilter: 'blur(10px)',
  },

  linkWrapper: {
    '&:active': {
      transform: 'scale(1.1)',
    },
  },

  link: {
    'width': 40,
    'height': 40,
    'borderRadius': theme.radius.md,
    'color': environment.currentEnvironment === 'desktop' ? theme.white : 'inherit',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',

    '&:hover': {
      backgroundColor:
        environment.currentEnvironment === 'desktop' ? theme.fn.rgba(theme.white, 0.2) : 'inherit',
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

function NavbarLink({ icon: Icon, label, onClick }: NavbarItem) {
  const { classes } = useStyles();
  return (
    <motion.div
      transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
      whileTap={{ scale: 0.9 }}>
      <Tooltip withinPortal label={app.localeManager.getI18nValue(label)} position="right">
        <UnstyledButton
          aria-label={app.localeManager.getI18nValue(label)}
          name={app.localeManager.getI18nValue(label)}
          onClick={onClick}
          className={classes.link}>
          <DisplayRenderableNode node={Icon} />
        </UnstyledButton>
      </Tooltip>
    </motion.div>
  );
}

function MacOSTitleBar() {
  return (
    <Box py={17} className="titlebar">
      <div className="titlebar-stoplight">
        <UnstyledButton
          component="div"
          onClick={() => environment.appWindow?.close()}
          className="titlebar-close">
          <svg x="0px" y="0px" viewBox="0 0 6.4 6.4">
            <polygon
              fill="#4d0000"
              points="6.4,0.8 5.6,0 3.2,2.4 0.8,0 0,0.8 2.4,3.2 0,5.6 0.8,6.4 3.2,4 5.6,6.4 6.4,5.6 4,3.2"
            />
          </svg>
        </UnstyledButton>
        <UnstyledButton
          component="div"
          onClick={() => environment.appWindow?.minimize()}
          className="titlebar-minimize">
          <svg x="0px" y="0px" viewBox="0 0 8 1.1">
            <rect fill="#995700" width="8" height="1.1" />
          </svg>
        </UnstyledButton>
        <UnstyledButton
          component="div"
          onClick={() => environment.appWindow?.toggleMaximize()}
          className="titlebar-fullscreen">
          <svg className="fullscreen-svg" x="0px" y="0px" viewBox="0 0 6 5.9">
            <path fill="#006400" d="M5.4,0h-4L6,4.5V0.6C5.7,0.6,5.3,0.3,5.4,0z" />
            <path fill="#006400" d="M0.6,5.9h4L0,1.4l0,3.9C0.3,5.3,0.6,5.6,0.6,5.9z" />
          </svg>
          <svg className="maximize-svg" x="0px" y="0px" viewBox="0 0 7.9 7.9">
            <polygon
              fill="#006400"
              points="7.9,4.5 7.9,3.4 4.5,3.4 4.5,0 3.4,0 3.4,3.4 0,3.4 0,4.5 3.4,4.5 3.4,7.9 4.5,7.9 4.5,4.5"
            />
          </svg>
        </UnstyledButton>
      </div>
    </Box>
  );
}

export function KasifNavbar() {
  const { classes } = useStyles();
  const os = getOS();
  const [navbarStore] = useSlice(app.navbarManager.store);
  const topItems = navbarStore.topItems.map(link => (
    <Transition delay={200} transition={animations.scale}>
      <span>
        <NavbarLink {...link} key={app.localeManager.getI18nValue(link.label)} />
      </span>
    </Transition>
  ));
  const bottomItems = navbarStore.bottomItems.map(link => (
    <Transition delay={200} transition={animations.scale}>
      <span>
        <NavbarLink {...link} key={app.localeManager.getI18nValue(link.label)} />
      </span>
    </Transition>
  ));

  const upperDividedTop = topItems.slice(0, app.navbarManager.initialTopItemsCount);
  const upperDividedBottom = topItems.slice(app.navbarManager.initialTopItemsCount);

  const lowerDividedTop = bottomItems.slice(0, app.navbarManager.initialBottomItemsCount);
  const lowerDividedBottom = bottomItems.slice(app.navbarManager.initialBottomItemsCount);

  const titleBarVisible = os === 'macos' && environment.currentEnvironment === 'desktop';

  return (
    <Transition transition="fade">
      <Navbar
        className={classes.navbar}
        withBorder={false}
        height="calc(100% - var(--titlebar-height))"
        sx={{ top: 'var(--titlebar-height)' }}
        width={{ base: 76 }}>
        {titleBarVisible && <MacOSTitleBar />}
        <Navbar.Section
          mb="lg"
          grow
          component={(props: any) => <ScrollArea {...props} scrollbarSize={8} />}>
          <Stack mt={titleBarVisible ? 0 : 'xs'} justify="center" align="center" spacing={4}>
            {upperDividedTop}
            {upperDividedBottom.length > 0 && (
              <Divider
                sx={theme => ({
                  borderColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
                  width: '60%',
                })}
              />
            )}
            {upperDividedBottom}
          </Stack>
        </Navbar.Section>
        <Navbar.Section my="sm">
          <Stack justify="center" align="center" spacing={4}>
            {lowerDividedBottom}
            {lowerDividedBottom.length > 0 && (
              <Divider
                sx={theme => ({
                  borderColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
                  width: '60%',
                })}
              />
            )}
            {lowerDividedTop}
          </Stack>
        </Navbar.Section>
      </Navbar>
    </Transition>
  );
}
