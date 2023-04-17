import '@kasif/config/i18n';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { CSSObject, MantineProvider, MantineTheme } from '@mantine/core';
import { Layout } from '@kasif/pages/Layout';
import { Notifications } from '@mantine/notifications';
import { app, kasif, tokens, useSetting } from '@kasif/config/app';
import { ThemeSetting } from '@kasif//config/settings';
import { SpotlightProvider } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons';
import { createPaneStyles } from '@kasif/util/pane';
import { useHotkeys } from '@mantine/hooks';
import { createGlobalStyles } from '@kasif/util/misc';
import { DndProvider } from '@kasif/config/dnd';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';
import { useSlice } from '@kasif/util/cinq-react';
import { ActionComponent } from '@kasif/components/Overlay/Spotlight';
import { ModalsProvider } from '@mantine/modals';
import { listen } from '@tauri-apps/api/event';
import { getMatches } from '@tauri-apps/api/cli';

app.notificationManager.log(
  `Kasif skeleton initialized. Version: ${kasif.version}`,
  'Skeleton initialized'
);

listen('tokens', ({ payload }: { payload: { message: string } }) => {
  tokens.set(JSON.parse(payload.message));
});

function Wrapper() {
  const [ready, setReady] = useState(false);
  const [themeID, setThemeID] = useState('default-light');
  const { theme } = app.themeManager.getTheme(themeID);
  const [themeSetting] = useSetting<ThemeSetting.Type>('theme');
  const [commands] = useSlice(app.commandManager.commands);
  const [globalStyles, setGlobalStyles] = useState<CSSObject>({});
  const killer = useRef<(() => void) | null>(null);

  useHotkeys(
    commands
      .filter((command) => Boolean(command.shortCut))
      .map((command) => [command.shortCut!, command.onTrigger])
  );

  useEffect(() => {
    setThemeID(themeSetting.value);
    createGlobalStyles().then(({ styles, kill }) => {
      setGlobalStyles(styles);
      killer.current = kill;
      setReady(true);
    });

    return () => {
      if (killer.current) killer.current();
    };
  }, [themeSetting.value]);

  useEffect(() => {
    getMatches().then((matches) => {
      app.flags.set({
        debug: matches.args.debug.value as boolean,
        plugins: matches.args.plugin.value as string[],
      });

      app.init();
    });

    return () => {
      app.kill();
    };
  }, []);

  return (
    <div data-contextmenu-field="app">
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          ...theme.ui,
          globalStyles: ((t) => ({
            ...globalStyles,
            ...createPaneStyles(t),
          })) as (theme: MantineTheme) => CSSObject,
        }}
      >
        <SpotlightProvider
          yOffset={10}
          actions={commands.map((command) => ({
            ...command,
            icon: command.icon ? <DisplayRenderableNode node={command.icon} /> : undefined,
          }))}
          searchIcon={<IconSearch size={18} />}
          searchPlaceholder="Jump..."
          actionComponent={(props) => <ActionComponent {...props} />}
          overlayProps={{
            blur: 0,
            opacity: 0,
          }}
          shortcut="mod+alt+p"
          shadow="xl"
          nothingFoundMessage="Nothing found..."
        >
          <ModalsProvider>
            <Notifications target="#notifications" position="bottom-right" zIndex={9999} />
            <DndProvider>{ready && <Layout />}</DndProvider>
          </ModalsProvider>
        </SpotlightProvider>
      </MantineProvider>
    </div>
  );
}

function App() {
  return <Wrapper />;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
