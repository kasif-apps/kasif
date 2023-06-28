import { MantineProviderProps, MantineTheme } from '@mantine/core';

import { app } from '@kasif/config/app';
import { LocaleString } from '@kasif/config/i18n';
import { BaseManager } from '@kasif/managers/base';
import { trackable, tracker } from '@kasif/util/decorators';

import { Slice, createSlice } from '@kasif-apps/cinq';
import { t } from 'i18next';

export interface ThemeOption {
  id: string;
  title: LocaleString;
  description: LocaleString;
  theme: {
    ui: Omit<MantineProviderProps['theme'], 'globalStyles'>;
  };
}

const sinope: MantineProviderProps['theme'] = {
  primaryColor: 'emerald',
  fontFamily: 'Roboto',
  colors: {
    gray: [
      '#fafaf9',
      '#f5f5f4',
      '#e7e5e4',
      '#d6d3d1',
      '#a8a29e',
      '#78716c',
      '#57534e',
      '#44403c',
      '#292524',
      '#1c1917',
    ],
    dark: [
      '#f5f5f4',
      '#e7e5e4',
      '#d6d3d1',
      '#a8a29e',
      '#78716c',
      '#57534e',
      '#44403c',
      '#292524',
      '#1c1917',
      '#0c0a09',
    ],
    blue: [
      '#f0f9ff',
      '#e0f2fe',
      '#bae6fd',
      '#7dd3fc',
      '#38bdf8',
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#075985',
      '#0c4a6e',
    ],
    emerald: [
      '#ecfdf5',
      '#d1fae5',
      '#a7f3d0',
      '#6ee7b7',
      '#34d399',
      '#10b981',
      '#059669',
      '#047857',
      '#065f46',
      '#064e3b',
    ],
  },
  defaultRadius: 'xs',
};

const istanbul: MantineProviderProps['theme'] = {
  primaryColor: 'rose',
  fontFamily: 'Gotham',
  colors: {
    gray: [
      '#f8fafc',
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1',
      '#94a3b8',
      '#64748b',
      '#475569',
      '#334155',
      '#1e293b',
      '#0f172a',
    ],
    dark: [
      '#f1f5f9',
      '#e2e8f0',
      '#cbd5e1',
      '#94a3b8',
      '#64748b',
      '#475569',
      '#334155',
      '#1e293b',
      '#0f172a',
      '#020617',
    ],
    rose: [
      '#fff1f2',
      '#ffe4e6',
      '#fecdd3',
      '#fda4af',
      '#fb7185',
      '#f43f5e',
      '#e11d48',
      '#be123c',
      '#9f1239',
      '#881337',
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
  defaultRadius: 'md',
};

@tracker('themeManager')
export class ThemeManager extends BaseManager {
  commonTheme: MantineProviderProps['theme'] = {
    primaryColor: 'indigo',
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
      title: {
        en: 'Default Light',
        tr: 'Varsayılan Açık',
      },
      description: {
        en: 'The default light theme.',
        tr: 'Varsayılan açık tema',
      },
      theme: {
        ui: {
          colorScheme: 'light',
          ...this.commonTheme,
        },
      },
    },
    {
      id: 'default-dark',
      title: {
        en: 'Default Dark',
        tr: 'Varsayılan Koyu',
      },
      description: {
        en: 'The default dark theme.',
        tr: 'Varsayılan koyu tema',
      },
      theme: {
        ui: { colorScheme: 'dark', ...this.commonTheme },
      },
    },
    {
      id: 'sinope-light',
      title: {
        en: 'Sinope Light',
        tr: 'Sinope Açık',
      },
      description: {
        en: 'Builtin Sinope light theme.',
        tr: 'Hazır Sinope açık tema',
      },
      theme: {
        ui: {
          colorScheme: 'light',
          ...sinope,
        },
      },
    },
    {
      id: 'sinope-dark',
      title: {
        en: 'Sinope dark',
        tr: 'Sinope Koyu',
      },
      description: {
        en: 'Builtin Sinope dark theme.',
        tr: 'Hazır Sinope koyu tema',
      },
      theme: {
        ui: {
          colorScheme: 'dark',
          ...sinope,
        },
      },
    },
    {
      id: 'istanbul-light',
      title: {
        en: 'İstanbul Light',
        tr: 'İstanbul Açık',
      },
      description: {
        en: 'Builtin İstanbul light theme.',
        tr: 'Hazır İstanbul açık tema',
      },
      theme: {
        ui: {
          colorScheme: 'light',
          ...istanbul,
        },
      },
    },
    {
      id: 'istanbul-dark',
      title: {
        en: 'İstanbul dark',
        tr: 'İstanbul Koyu',
      },
      description: {
        en: 'Builtin İstanbul dark theme.',
        tr: 'Hazır İstanbul koyu tema',
      },
      theme: {
        ui: {
          colorScheme: 'dark',
          ...istanbul,
        },
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
    const result = this.options.find(option => option.id === id);

    if (!result) {
      app.notificationManager.error(`${t('notification.theme-not-found.description')} ('${id}')`);
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
