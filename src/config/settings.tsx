import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Group, Select, Switch, Text } from '@mantine/core';

import { App, app, useSetting } from '@kasif/config/app';
import { Log } from '@kasif/managers/notification';
import { SettingCategory, SettingsItem } from '@kasif/managers/settings';
import { ThemeOption } from '@kasif/managers/theme';
import { environment } from '@kasif/util/environment';
import { getOS } from '@kasif/util/misc';

export interface BooleanActionProps {
  id: string;
}

export function BooleanAction(props: BooleanActionProps) {
  const [state, setState] = useSetting<boolean>(props.id);
  const { t } = useTranslation();

  return (
    <Switch
      onLabel={t('label.on')}
      offLabel={t('label.off')}
      size="lg"
      checked={state.value}
      onChange={e => setState(e.currentTarget.checked)}
    />
  );
}

export interface SelectActionProps<T extends string> {
  id: string;
  data: { value: T; label: string }[];
  placeholder?: string;
  onChange?: (value: T) => void;
}

export function SelectAction<T extends string>(props: SelectActionProps<T>) {
  const [state, setState] = useSetting<T>(props.id);

  return (
    <Select
      placeholder={props.placeholder}
      value={state.value}
      onChange={value => {
        if (value) {
          if (props.onChange) {
            props.onChange(value as T);
          } else {
            setState(value as T);
          }
        }
      }}
      data={props.data}
    />
  );
}

export namespace ThemeSetting {
  export type Type = ThemeOption['id'];
  const id = 'theme';

  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
    description: string;
  }

  const RenderItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ label, description, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <div>
            <Text size="sm">{label}</Text>
            <Text size="xs" opacity={0.65}>
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  export function Render() {
    const [theme, setTheme] = useSetting<Type>(id);
    const data = app.themeManager.options.map(option => ({
      label: option.title,
      description: option.description,
      value: option.id,
    }));

    return (
      <Select
        placeholder="Select Theme"
        value={theme.value}
        itemComponent={RenderItem}
        searchable
        nothingFound="Couldn't find any theme."
        sx={{ width: 300 }}
        filter={(value, item) =>
          item.label?.toLocaleLowerCase().includes(value.toLocaleLowerCase().trim()) ||
          item.description.toLocaleLowerCase().includes(value.toLocaleLowerCase().trim())
        }
        onChange={value => {
          if (value) {
            setTheme(value as Type);
          }
        }}
        data={data.map(item => ({
          ...item,
          label: app.localeManager.getI18nValue(item.label),
          description: app.localeManager.getI18nValue(item.description),
        }))}
      />
    );
  }

  export const definition = (instance: App): SettingsItem<Type> => ({
    id,
    category: 'appearance',
    title: instance.localeManager.get('settings.theme.title'),
    description: instance.localeManager.get('settings.theme.description'),
    value: 'default-light',
    render: Render,
  });
}

export namespace FontSetting {
  export type Type = string;
  const id = 'font';

  const baseFonts: { value: string; label: string }[] = [
    { value: 'Quicksand', label: 'Quicksand' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: '-apple-system', label: 'San Fransisco' },
    { value: '-windows-system', label: 'Segoe UI' },
  ];

  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
  }

  const RenderItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ label, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <div>
            <Text size="sm">{label}</Text>
          </div>
        </Group>
      </div>
    )
  );

  const getDefaultFont = () => {
    if (environment.currentEnvironment === 'web') {
      return 'Roboto';
    }

    const os = getOS();

    switch (os) {
      case 'macos':
      case 'ios':
        return '-apple-system';
      case 'windows':
        return 'Segoe UI';
      case 'linux':
        return 'Roboto';
      default:
        return 'Roboto';
    }
  };

  export const definition = (instance: App): SettingsItem<Type> => ({
    id,
    category: 'appearance',
    title: instance.localeManager.get('settings.font.title'),
    description: instance.localeManager.get('settings.font.description'),
    value: getDefaultFont(),
    render: () => {
      const [font, setFont] = useSetting<Type>(id);
      const [fonts, setFonts] = useState<{ value: string; label: string }[]>(baseFonts);

      useEffect(() => {
        environment.fontDir().then(async path => {
          const raw = await environment.fs.readDir(path);
          const data = raw.filter(file => file.name && file.name.endsWith('.ttf')) as {
            name: string;
          }[];

          const founFonts = data.map(item => {
            const name = item.name.split('.')[0];

            return { value: name, label: name };
          });

          founFonts.push(...fonts);

          setFonts(founFonts);
        });
      }, []);

      return (
        <Select
          placeholder="Select Font"
          value={font.value}
          itemComponent={RenderItem}
          searchable
          nothingFound="Couldn't find any font."
          sx={{ width: 300 }}
          filter={(value, item) =>
            item.label?.toLocaleLowerCase().includes(value.toLocaleLowerCase().trim())!
          }
          onChange={value => {
            if (value) {
              setFont(value as Type);
            }
          }}
          data={fonts}
        />
      );
    },
  });
}

export namespace LanguageSetting {
  export type Type = 'en' | 'tr';
  const id = 'language';

  export const definition = (instance: App): SettingsItem<Type> => ({
    id,
    category: 'appearance',
    title: instance.localeManager.get('settings.language.title'),
    description: instance.localeManager.get('settings.language.description'),
    value: 'en',
    render: () => {
      const [state, setState] = useSetting<Type>(id);
      const options = app.localeManager.getLocaleOptions();
      const data: { label: string; value: string }[] = [];

      for (const locale in options) {
        if (Object.prototype.hasOwnProperty.call(options, locale)) {
          const element = options[locale];
          data.push({ label: element.name, value: locale });
        }
      }

      return (
        <Select
          placeholder="Select Language"
          value={state.value}
          onChange={value => {
            if (value) {
              setState(value as Type);
            }
          }}
          data={data}
        />
      );
    },
  });
}

export namespace AnimationSetting {
  export type Type = boolean;
  const id = 'enable-animations';

  export const definition = (instance: App): SettingsItem<Type> => ({
    id,
    category: 'behavior',
    title: instance.localeManager.get('settings.animations.title'),
    description: instance.localeManager.get('settings.animations.description'),
    value: true,
    render: () => <BooleanAction id={id} />,
  });
}

export namespace LogLevelSetting {
  export type Type = keyof typeof Log;
  const id = 'log-level';

  export const definition = (instance: App): SettingsItem<Type> => ({
    id,
    category: 'behavior',
    title: instance.localeManager.get('settings.log-level.title'),
    description: instance.localeManager.get('settings.log-level.description'),
    value: 'SUCCESS',
    render: () => {
      const { t } = useTranslation();

      return (
        <SelectAction
          id={id}
          data={[
            { value: 'LOG', label: t('label.info') },
            { value: 'SUCCESS', label: t('label.success') },
            { value: 'WARNING', label: t('label.warning') },
            { value: 'ERROR', label: t('label.error') },
          ]}
          placeholder="Select Log Level"
        />
      );
    },
  });
}

export function getInitialSettings(instance: App): Array<SettingsItem<unknown>> {
  return [
    ThemeSetting.definition(instance),
    FontSetting.definition(instance),
    LanguageSetting.definition(instance),
    AnimationSetting.definition(instance),
    LogLevelSetting.definition(instance),
  ];
}

export function getInitialCategories(instance: App): Array<SettingCategory> {
  return [
    {
      id: 'appearance',
      title: instance.localeManager.get('settings.appearance.title'),
      description: instance.localeManager.get('settings.appearance.description'),
      color: 'orange',
    },
    {
      id: 'behavior',
      title: instance.localeManager.get('settings.behavior.title'),
      description: instance.localeManager.get('settings.behavior.description'),
      color: 'cyan',
    },
  ];
}
