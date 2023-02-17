import { OS } from '@mantine/hooks';

export function getCssVar(varaible: string): string {
  const root = document.querySelector(':root')!;
  const style = getComputedStyle(root);
  return style.getPropertyValue(varaible);
}

function getOS(): OS {
  const { userAgent } = window.navigator;
  const macosPlatforms = /(Macintosh)|(MacIntel)|(MacPPC)|(Mac68K)/i;
  const windowsPlatforms = /(Win32)|(Win64)|(Windows)|(WinCE)/i;
  const iosPlatforms = /(iPhone)|(iPad)|(iPod)/i;

  if (macosPlatforms.test(userAgent)) {
    return 'macos';
  }
  if (iosPlatforms.test(userAgent)) {
    return 'ios';
  }
  if (windowsPlatforms.test(userAgent)) {
    return 'windows';
  }
  if (/Android/i.test(userAgent)) {
    return 'android';
  }
  if (/Linux/i.test(userAgent)) {
    return 'linux';
  }

  return 'undetermined';
}

export function createShortcutLabel(...keys: string[]): string {
  let result = keys.map((key) => key.toLowerCase());
  const os = getOS();

  if (os === 'macos' || os === 'ios') {
    result = result.map((key) => {
      switch (key) {
        case 'ctrl':
        case 'control':
        case 'mod':
          return '⌘';
        case 'alt':
          return '⌥';
        case 'shift':
          return '⇧';
        case 'meta':
          return '⌃';
        default:
          return key;
      }
    });
  } else {
    result = result.map((key) => {
      switch (key) {
        case 'control':
        case 'ctrl':
        case 'mod':
          return 'Ctrl';
        case 'alt':
          return 'Alt';
        case 'shift':
          return 'Shift';
        case 'meta':
          return 'Win';
        default:
          return key;
      }
    });
  }

  return result.map((key) => key.toUpperCase()).join(' + ');
}
