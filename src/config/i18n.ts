import de from '@kasif/locales/de/common.json';
import en from '@kasif/locales/en/common.json';
import fr from '@kasif/locales/fr/common.json';
import tr from '@kasif/locales/tr/common.json';
import zhCn from '@kasif/locales/zh-cn/common.json';

export type LocaleString = Record<string, string> & { en: string; tr?: string };

export const initialLocales = [
  { key: 'en', name: 'English', translation: en },
  { key: 'fr', name: 'Français', translation: fr },
  { key: 'de', name: 'Deutsch', translation: de },
  { key: 'tr', name: 'Türkçe', translation: tr },
  { key: 'zh-cn', name: 'Simplified Chinese', translation: zhCn },
];
