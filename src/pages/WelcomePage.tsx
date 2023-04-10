import { createStyles, Stack } from '@mantine/core';
import { createSlice, StorageTransactor } from '@kasif-apps/cinq';

const moreViewDismissed = createSlice(false, { key: 'more-view-dismissed' });
const transactor = new StorageTransactor({
  key: 'welcome-page',
  slice: moreViewDismissed,
  type: 'localStorage',
  model: StorageTransactor.Boolean,
});

transactor.init();

const useStyles = createStyles(() => ({
  image: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundImage: 'url(/splashes/bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
}));

export function WelcomePage() {
  const { classes } = useStyles();

  return (
    <Stack spacing="sm" pt={0} sx={{ maxWidth: 1200, margin: 'auto', height: '100%' }}>
      <div className={classes.image} />
    </Stack>
  );
}
