import { app } from '@kasif/config/app';
import { MantineProviderProps } from '@mantine/core';

export interface ThemeOption {
  id: string;
  title: string;
  description: string;
  theme: {
    ui: Omit<MantineProviderProps['theme'], 'globalStyles'>;
  };
}

export class ThemeManager extends EventTarget {
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

  getTheme(id: ThemeOption['id']): ThemeOption {
    const result = this.options.find((option) => option.id === id);

    if (!result) {
      app.notificationManager.error(`Theme option with id "${id}" not found.`);
    }

    return result || this.options[0];
  }

  defineTheme(option: ThemeOption) {
    this.options.push(option);
    this.dispatchEvent(new CustomEvent('defşne-theme', { detail: option }));
  }
}
