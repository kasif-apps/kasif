import ReactDOM from 'react-dom/client';
import { CSSObject, MantineProvider, MantineTheme } from '@mantine/core';
import { Layout } from '@kasif/pages/Layout';
import { NotificationsProvider } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { app, useSetting } from '@kasif/config/app';
import { ThemeSetting } from '@kasif//config/settings';
import { initPlugins } from '@kasif/managers/plugin';
import { SpotlightProvider } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons';
import { createPaneStyles } from '@kasif/util/pane';
import { useHotkeys } from '@mantine/hooks';
import { createGlobalStyles } from '@kasif/util/misc';
import { ActionComponent, actions, SpotlightControl } from './components/Overlay/Spotlight';

function Wrapper() {
  const [ready, setReady] = useState(false);
  const [themeID, setThemeID] = useState('default-light');
  const { theme } = app.themeManager.getTheme(themeID);
  const [themeSetting] = useSetting<ThemeSetting.Type>('theme');

  useHotkeys(
    app.commandManager.commands
      .filter((command) => Boolean(command.shortCut))
      .map((command) => [command.shortCut!, command.onTrigger])
  );

  useEffect(() => {
    setThemeID(themeSetting.value);
    setReady(true);
  }, [themeSetting.value]);

  useEffect(() => {
    initPlugins(app);
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        ...theme.ui,
        globalStyles: ((t) => ({
          ...createGlobalStyles(),
          ...createPaneStyles(t),
        })) as (theme: MantineTheme) => CSSObject,
      }}
    >
      <NotificationsProvider target="#notifications" position="bottom-right" zIndex={9999}>
        {ready && <Layout />}
      </NotificationsProvider>
      <SpotlightProvider
        actions={actions}
        searchIcon={<IconSearch size={18} />}
        searchPlaceholder="Jump..."
        actionComponent={ActionComponent}
        overlayBlur={0}
        overlayOpacity={0}
        shadow="xl"
        nothingFoundMessage="Nothing found..."
      >
        <SpotlightControl />
      </SpotlightProvider>
    </MantineProvider>
  );
}

function App() {
  return (
    // <React.StrictMode>
    <Wrapper />
    // </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
