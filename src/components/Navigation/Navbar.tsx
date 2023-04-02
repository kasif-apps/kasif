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

const useStyles = createStyles((theme) => ({
  link: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
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
    <Tooltip withinPortal label={label} position="right" transitionDuration={0}>
      <UnstyledButton onClick={onClick} className={classes.link}>
        <DisplayRenderableNode node={Icon} />
      </UnstyledButton>
    </Tooltip>
  );
}

export function KasifNavbar() {
  const [navbarStore] = useSlice(app.navbarManager.store);
  const topItems = navbarStore.topItems.map((link) => <NavbarLink {...link} key={link.label} />);
  const bottomItems = navbarStore.bottomItems.map((link) => (
    <NavbarLink {...link} key={link.label} />
  ));

  const upperDividedTop = topItems.slice(0, app.navbarManager.initialTopItemsCount);
  const upperDividedBottom = topItems.slice(app.navbarManager.initialTopItemsCount);

  const lowerDividedTop = bottomItems.slice(0, app.navbarManager.initialBottomItemsCount);
  const lowerDividedBottom = bottomItems.slice(app.navbarManager.initialBottomItemsCount);

  return (
    <Navbar withBorder={false} height="100%" sx={{ top: 0 }} width={{ base: 64 }}>
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
