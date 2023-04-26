import en from '@kasif/locales/en/common.json';
import tr from '@kasif/locales/tr/common.json';

export type I18nString = Record<string, string> & { en: string; tr?: string };

export const initialLocales = [
  { key: 'en', translation: en },
  { key: 'tr', translation: tr },
];
