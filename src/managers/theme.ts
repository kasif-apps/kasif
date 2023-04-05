import { app } from '@kasif/config/app';
import { MantineProviderProps, MantineTheme } from '@mantine/core';
import { BaseManager } from '@kasif/managers/base';
import { trackable, tracker } from '@kasif/util/misc';
import { createSlice, Slice } from '@kasif-apps/cinq';

export interface ThemeOption {
  id: string;
  title: string;
  description: string;
  theme: {
    ui: Omit<MantineProviderProps['theme'], 'globalStyles'>;
  };
}

@tracker('themeManager')
export class ThemeManager extends BaseManager {
  commonTheme: MantineProviderProps['theme'] = {
    primaryColor: 'kasif',
    colors: {
      kasif: [
        '#f8d1d0',
        '#f5bab8',
        '#f2a3a0',
        '#e85d59',
        '#e12f2a',
        '#e54641',
        '#de1812',
        '#c81610',
        '#9b110d',
        '#850e0b',
      ],
    },
    components: {
      Select: {
        defaultProps: {
          variant: 'filled',
        },
      },
      Input: {
        defaultProps: {
          variant: 'filled',
        },
      },
      Button: {
        defaultProps: {
          radius: 'xl',
        },
      },
    },
  };

  options: ThemeOption[] = [
    {
      id: 'default-light',
      title: 'Default Light',
      description: 'The default light theme.',
      theme: {
        ui: {
          colorScheme: 'light',
          ...this.commonTheme,
        },
      },
    },
    {
      id: 'default-dark',
      title: 'Default Dark',
      description: 'The default dark theme.',
      theme: {
        ui: { colorScheme: 'dark', ...this.commonTheme },
      },
    },
  ];

  interface: Slice<MantineTheme | null> = createSlice(null, {
    key: 'interface',
  }) as Slice<MantineTheme | null>;

  @trackable
  getInterfaceSnapshot() {
    return this.interface.get();
  }

  @trackable
  getTheme(id: ThemeOption['id']): ThemeOption {
    const result = this.options.find((option) => option.id === id);

    if (!result) {
      app.notificationManager.error(`Theme option with id "${id}" not found.`);
    }

    return result || this.options[0];
  }

  @trackable
  getCurrentTheme(): ThemeOption {
    const id = this.app.settingsManager.getSetting<ThemeOption['id']>('theme')!;

    return this.getTheme(id);
  }

  @trackable
  defineTheme(option: ThemeOption) {
    this.options.push(option);
    this.dispatchEvent(new CustomEvent('define-theme', { detail: option }));
  }
}
