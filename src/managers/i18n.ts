import { initReactI18next } from 'react-i18next';

import { LocaleString, initialLocales } from '@kasif/config/i18n';
import { BaseManager } from '@kasif/managers/base';
import { trackable, tracker } from '@kasif/util/decorators';

import { createRecordSlice } from '@kasif-apps/cinq';
import * as instance from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export interface DefineLocaleOptions {
  key: string;
  name: string;
  translation: instance.Resource;
  reinit?: boolean;
}
@tracker('localeManager')
export class LocaleManager extends BaseManager {
  #store = createRecordSlice<Record<string, { name: string; resource: instance.Resource }>>(
    {},
    { key: 'locales' }
  );

  init() {
    for (const locale of initialLocales) {
      this.defineLocale({
        key: locale.key,
        name: locale.name,
        translation: locale.translation,
        reinit: false,
      });
    }
    const resources: Record<string, instance.Resource> = {};

    const store = this.#store.get();
    for (const key in store) {
      if (Object.prototype.hasOwnProperty.call(store, key)) {
        const element = store[key];
        resources[key] = element.resource;
      }
    }

    instance
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        debug: import.meta.env.MODE === 'development',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        resources,
      });

    const html = document.getElementsByTagName('html')[0];
    html.setAttribute('lang', instance.default.language);
  }

  @trackable
  getKey(key: string): string {
    return instance.t(key);
  }

  @trackable
  getI18nValue(input: LocaleString): string {
    const { language } = instance.default;
    const result = input[language];

    if (result) {
      return result;
    }

    return input.en;
  }

  @trackable
  defineLocale(options: DefineLocaleOptions) {
    this.#store.upsert({
      [options.key]: { resource: { translation: options.translation }, name: options.name },
    });

    if (options.reinit) {
      this.init();
    }
  }

  @trackable
  getLocaleOptions() {
    return this.#store.get();
  }

  @trackable
  get(key: string): LocaleString {
    const result: LocaleString = {
      en: key,
    };

    const store = this.#store.get();

    for (const locale in store) {
      if (Object.prototype.hasOwnProperty.call(store, locale)) {
        result[locale] = instance.t(key, { lng: locale });
      }
    }

    return result;
  }
}
