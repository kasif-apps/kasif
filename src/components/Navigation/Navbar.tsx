import { app } from '@kasif/config/app';
import { NavbarItem } from '@kasif/managers/navbar';
import { useSlice } from '@kasif/util/cinq-react';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';
import {
  Navbar,
  Center,
  Tooltip,
  UnstyledButton,
  createStyles,
  Stack,
  ScrollArea,
  Divider,
} from '@mantine/core';

const useStyles = createStyles((theme, { isHomeView }: { isHomeView: boolean }) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors.dark[7], isHomeView ? 0.2 : 1)
        : theme.fn.rgba(theme.colors.gray[0], isHomeView ? 0.2 : 1),

    backdropFilter: 'blur(5px)',
  },

  link: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isHomeView
      ? theme.white
      : theme.colorScheme === 'dark'
      ? theme.colors.dark[0]
      : theme.colors.gray[7],

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors.dark[5], isHomeView ? 0.2 : 1)
          : theme.fn.rgba(theme.colors.gray[0], isHomeView ? 0.2 : 1),
      backdropFilter: 'blur(5px)',
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

function NavbarLink({
  icon: Icon,
  label,
  onClick,
  isHomeView,
}: NavbarItem & { isHomeView: boolean }) {
  const { classes } = useStyles({ isHomeView });
  return (
    <Tooltip withinPortal label={label} position="right">
      <UnstyledButton onClick={onClick} className={classes.link}>
        <DisplayRenderableNode node={Icon} />
      </UnstyledButton>
    </Tooltip>
  );
}

export function KasifNavbar() {
  const [viewStore] = useSlice(app.viewManager.store);
  const isHomeView = viewStore.currentView === null;
  const { classes } = useStyles({ isHomeView });
  const [navbarStore] = useSlice(app.navbarManager.store);
  const topItems = navbarStore.topItems.map((link) => (
    <NavbarLink isHomeView={isHomeView} {...link} key={link.label} />
  ));
  const bottomItems = navbarStore.bottomItems.map((link) => (
    <NavbarLink isHomeView={isHomeView} {...link} key={link.label} />
  ));

  const upperDividedTop = topItems.slice(0, app.navbarManager.initialTopItemsCount);
  const upperDividedBottom = topItems.slice(app.navbarManager.initialTopItemsCount);

  const lowerDividedTop = bottomItems.slice(0, app.navbarManager.initialBottomItemsCount);
  const lowerDividedBottom = bottomItems.slice(app.navbarManager.initialBottomItemsCount);

  return (
    <Navbar
      className={classes.navbar}
      withBorder={false}
      height="100%"
      sx={{ top: 0 }}
      width={{ base: 64 }}
    >
      <Center mt="md">
        <img src="/favicon.png" alt="logo" height={26} />
      </Center>
      <Navbar.Section
        mb="lg"
        grow
        mt={18}
        component={(props: any) => <ScrollArea {...props} scrollbarSize={8} />}
      >
        <Stack justify="center" align="center" spacing={4}>
          {upperDividedTop}
          {upperDividedBottom.length > 0 && (
            <Divider
              sx={(theme) => ({
                borderColor:
                  theme.colorScheme === 'dark'
                    ? theme.fn.rgba(
                        isHomeView ? theme.colors.gray[2] : theme.colors.dark[5],
                        isHomeView ? 0.2 : 1
                      )
                    : theme.fn.rgba(theme.colors.gray[2], isHomeView ? 0.2 : 1),
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
              sx={(theme) => ({
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
  );
}
