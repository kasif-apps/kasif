import { CSSObject } from '@emotion/react';
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

export function createGlobalStyles(): CSSObject {
  return {
    '*': {
      userSelect: 'none',
    },

    'html, body': {
      overflow: 'hidden',
    },

    'main .mantine-ScrollArea-viewport > div': {
      height: '100%',
    },
  };
}

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function createFallDown(amount: number, max: number) {
  return {
    in: { opacity: 1, transform: 'translateY(0)' },
    out: {
      opacity: 0,
      transform: `translateY(-${((amount * 100) / max) * 2}%)`,
    },
    common: { transformOrigin: 'top' },
    transitionProperty: 'transform, opacity',
  };
}

export function createSlideIn(amount: number, max: number) {
  return {
    in: { opacity: 1, transform: 'translateX(0)' },
    out: {
      opacity: 0,
      transform: `translateX(-${((amount * 100) / max) * 2}%)`,
    },
    common: { transformOrigin: 'left' },
    transitionProperty: 'transform, opacity',
  };
}

export function createScale() {
  return {
    in: { opacity: 1, transform: 'scale(1)' },
    out: {
      opacity: 0,
      transform: 'scale(0.8)',
    },
    common: { transformOrigin: 'center' },
    transitionProperty: 'transform, opacity',
  };
}
