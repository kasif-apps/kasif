import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { CSSObject, MantineProvider, MantineTheme } from '@mantine/core';
import { Layout } from '@kasif/pages/Layout';
import { NotificationsProvider } from '@mantine/notifications';
import { app, nexus, useSetting } from '@kasif/config/app';
import { ThemeSetting } from '@kasif//config/settings';
import { initApps } from '@kasif/managers/plugin';
import { SpotlightProvider } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons';
import { createPaneStyles } from '@kasif/util/pane';
import { useHotkeys } from '@mantine/hooks';
import { createGlobalStyles } from '@kasif/util/misc';
import { DndProvider } from '@kasif/config/dnd';
import { ActionComponent, actions } from '@kasif/components/Overlay/Spotlight';
import { initCommands } from '@kasif/config/command';

app.notificationManager.log(
  `Nexus skeleton initialized. Version: ${nexus.version}`,
  'Skeleton initialized'
);

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
    initCommands();
    initApps(app);

    return () => {
      app.networkManager.kill();
    };
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
      <SpotlightProvider
        topOffset={10}
        actions={actions}
        searchIcon={<IconSearch size={18} />}
        searchPlaceholder="Jump..."
        actionComponent={(props) => <ActionComponent {...props} />}
        overlayBlur={0}
        overlayOpacity={0}
        shortcut="mod+alt+p"
        shadow="xl"
        nothingFoundMessage="Nothing found..."
      >
        <NotificationsProvider target="#notifications" position="bottom-right" zIndex={9999}>
          <DndProvider>{ready && <Layout />}</DndProvider>
        </NotificationsProvider>
      </SpotlightProvider>
    </MantineProvider>
  );
}

function App() {
  return <Wrapper />;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
