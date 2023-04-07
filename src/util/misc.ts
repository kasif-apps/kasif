import { CSSObject } from '@emotion/react';
import { App, kasif } from '@kasif/config/app';
import { BaseManager } from '@kasif/managers/base';
import { OS } from '@mantine/hooks';

export function getCssVar(varaible: string): string {
  const root = document.querySelector(':root')!;
  const style = getComputedStyle(root);
  return style.getPropertyValue(varaible);
}

export function setCssVar(variable: string, value: string) {
  const root = document.querySelector(':root')! as HTMLElement;
  root.style.setProperty(variable, value);
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

    "button, input, textarea, select, a[href], [tabindex='0'], [role='button']": {
      pointerEvents: 'var(--app-pointer-events, auto)' as 'auto' | 'none',
    },

    'html, body': {
      overflow: 'hidden',
    },

    'main .mantine-ScrollArea-viewport > div': {
      height: '100%',
    },
  };
}

export function createShortcutLabelFromString(shortCut: string) {
  return createShortcutLabel(...shortCut.split('+').map((key) => key.trim()));
}

export function getRelativeTime(timestamp: Date) {
  const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;
  const rtf = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
    style: 'long',
  });
  const daysDifference = Math.round(
    (timestamp.getTime() - new Date().getTime()) / DAY_MILLISECONDS
  );

  return rtf.format(daysDifference, 'seconds');
}

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const animations = {
  scale: {
    in: { opacity: 1, transform: 'scale(1)' },
    out: {
      opacity: 0,
      transform: 'scale(0.8)',
    },
    common: { transformOrigin: 'center' },
    transitionProperty: 'transform, opacity',
  },
  slideIn(amount: number, max: number) {
    return {
      in: { opacity: 1, transform: 'translateX(0)' },
      out: {
        opacity: 0,
        transform: `translateX(-${((amount * 100) / max) * 2}%)`,
      },
      common: { transformOrigin: 'left' },
      transitionProperty: 'transform, opacity',
    };
  },
  fallDown(amount: number, max: number) {
    return {
      in: { opacity: 1, transform: 'translateY(0)' },
      out: {
        opacity: 0,
        transform: `translateY(-${((amount * 100) / max) * 2}%)`,
      },
      common: { transformOrigin: 'top' },
      transitionProperty: 'transform, opacity',
    };
  },
};

export function getFirstNodeInPath(
  path: HTMLElement[],
  attributeName: string,
  attributeValue?: string
): HTMLElement | null {
  let found: HTMLElement | null = null;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < path.length; i++) {
    const element = path[i];

    if (element.hasAttribute(attributeName)) {
      if (attributeValue) {
        if (element.getAttribute(attributeName) === attributeValue) {
          found = element;
          break;
        }
      } else {
        found = element;
        break;
      }
    }
  }

  return found;
}

export function trackable(
  target: BaseManager,
  propertyKey: string,
  _descriptor: PropertyDescriptor
) {
  const originalValue = _descriptor.value;
  const descriptor = _descriptor;

  descriptor.value = function descValue(...args: any[]) {
    const identifier = target.constructor.prototype.identifier as keyof App;
    const instance = this as BaseManager;
    const key = propertyKey as keyof BaseManager;

    if (instance.parent && identifier) {
      const parent = instance.parent[identifier] as BaseManager;
      const targetMethod = parent[key];

      if (typeof targetMethod === 'function') {
        if (parent && parent.app) {
          parent.app.id = instance.app.id;
          parent.app.name = instance.app.name;
          parent.app.version = instance.app.version;
        }

        // @ts-expect-error
        const result = targetMethod.apply(instance.parent[identifier], args);

        if (parent && parent.app) {
          parent.app.id = kasif.id;
          parent.app.name = kasif.name;
          parent.app.version = kasif.version;
        }
        return result;
      }
    }

    return originalValue.apply(this, args);
  };
}

export function tracker(identifier: keyof App) {
  return function t(_constructor: Function) {
    const constructor = _constructor;
    constructor.prototype.identifier = identifier;
  };
}
