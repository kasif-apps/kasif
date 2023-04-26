import { initReactI18next } from 'react-i18next';

import { I18nString, initialLocales } from '@kasif/config/i18n';
import { BaseManager } from '@kasif/managers/base';
import { trackable, tracker } from '@kasif/util/decorators';

import { createRecordSlice } from '@kasif-apps/cinq';
import * as instance from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

@tracker('localeManager')
export class LocaleManager extends BaseManager {
  #store = createRecordSlice<Record<string, instance.Resource>>({}, { key: 'locales' });

  init() {
    for (const locale of initialLocales) {
      this.defineLocale(locale.key, locale.translation);
    }
    const resources = this.#store.get();

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
  }

  @trackable
  getKey(key: string): string {
    return instance.t(key);
  }

  @trackable
  getI18nValue(input: I18nString): string {
    const { language } = instance.default;
    const result = input[language];

    if (result) {
      return result;
    }

    return input.en;
  }

  @trackable
  defineLocale(key: string, translation: instance.Resource) {
    this.#store.upsert({ [key]: { translation } });
  }
}
