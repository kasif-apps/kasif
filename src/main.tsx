import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useTranslation } from 'react-i18next';

import { CSSObject, MantineProvider, MantineTheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { SpotlightProvider } from '@mantine/spotlight';

import { ActionComponent } from '@kasif/components/Overlay/Spotlight';
import { app, kasif, useSetting } from '@kasif/config/app';
import { DndProvider } from '@kasif/config/dnd';
import { ThemeSetting } from '@kasif/config/settings';
import { Layout } from '@kasif/pages/Layout';
import { useSlice } from '@kasif/util/cinq-react';
import { createGlobalStyles } from '@kasif/util/misc';
import { DisplayRenderableNode } from '@kasif/util/node-renderer';
import { createPaneStyles } from '@kasif/util/pane';

import { IconSearch } from '@tabler/icons';

function App() {
  const [ready, setReady] = useState(false);
  const [themeID, setThemeID] = useState('default-light');
  const { theme } = app.themeManager.getTheme(themeID);
  const [themeSetting] = useSetting<ThemeSetting.Type>('theme');
  const [commands] = useSlice(app.commandManager.commands);
  const [settingsReady] = useSlice(app.settingsManager.ready);
  const [permissionsReady] = useSlice(app.permissionManager.ready);
  const [globalStyles, setGlobalStyles] = useState<CSSObject>({});
  const [font] = useSetting<string>('font');
  const killer = useRef<(() => void) | null>(null);
  const { t } = useTranslation();

  useHotkeys(
    commands
      .filter(command => Boolean(command.shortCut))
      .map(command => [command.shortCut!, command.onTrigger])
  );

  useEffect(() => {
    setThemeID(themeSetting.value);
    createGlobalStyles().then(({ styles, kill }) => {
      setGlobalStyles(styles);
      killer.current = kill;

      if (settingsReady && permissionsReady) {
        setReady(true);
      }
    });

    return () => {
      if (killer.current) killer.current();
    };
  }, [themeSetting.value, settingsReady, permissionsReady]);

  useEffect(() => {
    app.init();

    app.notificationManager.log(
      `${t('notification.skeleton-initialized.description')} ${kasif.version}`,
      t('notification.skeleton-initialized.title')!
    );

    return () => {
      app.kill();
    };
  }, []);

  return (
    <div>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          ...theme.ui,
          fontFamily: font.value,
          globalStyles: (ui => ({
            ...globalStyles,
            ...createPaneStyles(ui),
          })) as (theme: MantineTheme) => CSSObject,
        }}>
        <SpotlightProvider
          yOffset={10}
          actions={commands.map(command => ({
            ...command,
            title: app.localeManager.getI18nValue(command.title),
            icon: command.icon ? <DisplayRenderableNode node={command.icon} /> : undefined,
          }))}
          searchIcon={<IconSearch size={18} />}
          searchPlaceholder="Jump..."
          actionComponent={props => <ActionComponent {...props} />}
          overlayProps={{
            blur: 0,
            opacity: 0,
          }}
          shortcut="mod+alt+p"
          shadow="xl"
          nothingFoundMessage="Nothing found...">
          <ModalsProvider>
            <Notifications target="#notifications" position="bottom-right" zIndex={9999} />
            <DndProvider>{ready && <Layout />}</DndProvider>
          </ModalsProvider>
        </SpotlightProvider>
      </MantineProvider>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
