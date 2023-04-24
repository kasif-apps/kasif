import { forwardRef } from 'react';

import { Group, Select, Switch, Text } from '@mantine/core';

import { app, useSetting } from '@kasif/config/app';
import { Log } from '@kasif/managers/notification';
import { SettingCategory, SettingsItem } from '@kasif/managers/settings';
import { ThemeOption } from '@kasif/managers/theme';

export interface BooleanActionProps {
  id: string;
}

export function BooleanAction(props: BooleanActionProps) {
  const [state, setState] = useSetting<boolean>(props.id);

  return (
    <Switch
      onLabel="ON"
      offLabel="OFF"
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
          item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.description.toLowerCase().includes(value.toLowerCase().trim())
        }
        onChange={value => {
          if (value) {
            setTheme(value as Type);
          }
        }}
        data={data}
      />
    );
  }

  export const definition: SettingsItem<Type> = {
    id,
    category: 'appearance',
    title: 'Theme',
    description: 'Change the theme of the app.',
    value: 'default-light',
    render: Render,
  };
}

export namespace FontSetting {
  export type Type = 'roboto' | 'open-sans' | 'raleway';
  const id = 'font';

  export const definition: SettingsItem<Type> = {
    id,
    category: 'appearance',
    title: 'Font',
    description: 'Change the font of the app.',
    value: 'open-sans',
    render: () => (
      <SelectAction
        id={id}
        data={[
          { value: 'open-sans', label: 'Open Sans' },
          { value: 'roboto', label: 'Roboto' },
          { value: 'raleway', label: 'Raleway' },
        ]}
        placeholder="Select Font"
      />
    ),
  };
}

export namespace LanguageSetting {
  export type Type = 'en' | 'tr';
  const id = 'language';

  export const definition: SettingsItem<Type> = {
    id,
    category: 'appearance',
    title: 'Language',
    description: 'Change the display language of the app.',
    value: 'en',
    render: () => (
      <SelectAction
        id={id}
        data={[
          { value: 'en', label: 'English' },
          { value: 'tr', label: 'Turkish' },
        ]}
        placeholder="Select Language"
      />
    ),
  };
}

export namespace AnimationSetting {
  export type Type = boolean;
  const id = 'enable-animations';

  export const definition: SettingsItem<Type> = {
    id,
    category: 'behavior',
    title: 'Animations',
    description: 'Enable the animations througout the app.',
    value: true,
    render: () => <BooleanAction id={id} />,
  };
}

export namespace LogLevelSetting {
  export type Type = keyof typeof Log;
  const id = 'log-level';

  export const definition: SettingsItem<Type> = {
    id,
    category: 'behavior',
    title: 'Log Level',
    description: 'Change the log display behavior of the app. Success is recommended.',
    value: 'SUCCESS',
    render: () => (
      <SelectAction
        id={id}
        data={[
          { value: 'LOG', label: 'Info' },
          { value: 'SUCCESS', label: 'Success' },
          { value: 'WARNING', label: 'Warning' },
          { value: 'ERROR', label: 'Error' },
        ]}
        placeholder="Select Log Level"
      />
    ),
  };
}

export const initialSettings: Array<SettingsItem<any>> = [
  ThemeSetting.definition,
  FontSetting.definition,
  LanguageSetting.definition,
  AnimationSetting.definition,
  LogLevelSetting.definition,
];

export const initialCategories: Array<SettingCategory> = [
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Change the appearance of the app.',
    color: 'orange',
  },
  {
    id: 'behavior',
    title: 'Behavior',
    description: 'Basic & advanced behaviour related settings.',
    color: 'cyan',
  },
];
