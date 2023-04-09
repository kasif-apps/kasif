import { initReactI18next } from 'react-i18next';

import * as i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en/common.json';
import tr from '../locales/tr/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.MODE === 'development',
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
      },
      tr: {
        translation: tr,
      },
    },
  });

export default i18n;
