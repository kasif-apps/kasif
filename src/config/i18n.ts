import en from '@kasif/locales/en/common.json';
import tr from '@kasif/locales/tr/common.json';

export type LocaleString = Record<string, string> & { en: string; tr?: string };

export const initialLocales = [
  { key: 'en', name: 'English', translation: en },
  { key: 'tr', name: 'Türkçe', translation: tr },
  { key: 'es', name: 'Español', translation: en },
  { key: 'fr', name: 'Française', translation: en },
];
