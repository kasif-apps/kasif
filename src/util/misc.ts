import { OS } from '@mantine/hooks';
import { environment } from '@kasif/util/environment';
import { listen } from '@tauri-apps/api/event';
import { app } from '@kasif/config/app';
import { CSSObject } from '@mantine/core';

export function getCssVar(varaible: string): string {
  const root = document.querySelector(':root')!;
  const style = getComputedStyle(root);
  return style.getPropertyValue(varaible);
}

export function setCssVar(variable: string, value: string) {
  const root = document.querySelector(':root')! as HTMLElement;
  root.style.setProperty(variable, value);
}

export function getOS(): OS {
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

export async function createGlobalStyles(): Promise<{ styles: CSSObject; kill: () => void }> {
  const os = getOS();
  let titlebarHeight: string = '0px';

  if (environment.currentEnvironment === 'web') {
    titlebarHeight = '0px';
  } else {
    switch (os) {
      case 'macos':
        titlebarHeight = '0px';
        break;
      case 'windows':
      case 'linux':
        titlebarHeight = '30px';
        break;
    }
  }
  setCssVar('--action-color', 'inherit');

  const unListenFocus = await listen('tauri://focus', () => {
    setCssVar('--action-color', 'inherit');
  });

  const unListenBlur = await listen('tauri://blur', () => {
    const ui = app.themeManager.interface.get();

    if (ui) {
      const blurColor = ui.colorScheme === 'dark' ? ui.colors.dark[4] : ui.colors.gray[2];
      setCssVar('--action-color', blurColor);
    }
  });

  const styles = {
    ':root': {
      '--titlebar-height': titlebarHeight,
      '--window-border-radius': '8px',
    },

    '*': {
      userSelect: 'none',
    },

    "button, input, textarea, select, a[href], [tabindex='0'], [role='button']": {
      pointerEvents: 'var(--app-pointer-events, auto)' as 'auto' | 'none',
    },

    'html, body, #root': {
      overflow: 'hidden',
      borderRadius: 'var(--window-border-radius)',
      backgroundColor: 'transparent',
    },

    nav: {
      borderTopLeftRadius: 'var(--window-border-radius)',
      borderBottomLeftRadius: 'var(--window-border-radius)',
    },

    footer: {
      borderBottomRightRadius: 'var(--window-border-radius)',
    },

    header: {
      borderTopRightRadius: 'var(--window-border-radius)',
    },

    'main .mantine-ScrollArea-viewport > div': {
      height: '100%',
    },

    '.titlebar': { display: 'flex', justifyContent: 'center' },
    '.titlebar.webkit-draggable': { WebkitAppRegion: 'drag' },
    '.titlebar-stoplight': { display: 'flex' },
    '.titlebar-stoplight:hover svg,\n.titlebar-stoplight:hover svg.fullscreen-svg,\n.titlebar-stoplight:hover svg.maximize-svg':
      {
        opacity: 1,
      },
    '.titlebar.alt svg.fullscreen-svg': { display: 'none' },
    '.titlebar.alt svg.maximize-svg': { display: 'block' },
    '.titlebar-close,\n.titlebar-minimize,\n.titlebar-fullscreen': {
      cssFloat: 'left',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      margin: '6px 4px',
      lineHeight: 0,
    },
    '.titlebar.webkit-draggable .titlebar-close,\n.titlebar.webkit-draggable .titlebar-minimize,\n.titlebar.webkit-draggable .titlebar-fullscreen':
      {
        WebkitAppRegion: 'no-drag',
      },
    '.titlebar-close': {
      border: '1px solid var(--action-color, #e2463f)',
      backgroundColor: 'var(--action-color, #ff5f57)',
    },
    '.titlebar-close:active': {
      borderColor: '#ad3934',
      backgroundColor: 'var(--action-color, #bf4943)',
    },
    '.titlebar-close svg': {
      width: '6px',
      height: '6px',
      marginTop: '2px',
      marginLeft: '2px',
      opacity: 0,
    },
    '.titlebar-minimize': {
      border: '1px solid var(--action-color, #e1a116)',
      backgroundColor: 'var(--action-color, #ffbd2e)',
    },
    '.titlebar-minimize:active': {
      borderColor: '#ad7d15',
      backgroundColor: 'var(--action-color, #bf9123)',
    },
    '.titlebar-minimize svg': {
      width: '8px',
      height: '8px',
      marginTop: '1px',
      marginLeft: '1px',
      opacity: 0,
    },
    '.titlebar-fullscreen,\n.titlebar-maximize': {
      border: '1px solid var(--action-color, #12ac28)',
      backgroundColor: 'var(--action-color, #28c940)',
    },
    '.titlebar-fullscreen:active': {
      borderColor: '#128622',
      backgroundColor: 'var(--action-color, #1f9a31)',
    },
    '.titlebar-fullscreen svg.fullscreen-svg': {
      width: '6px',
      height: '6px',
      marginTop: '2px',
      marginLeft: '2px',
      opacity: 0,
    },
    '.titlebar-fullscreen svg.maximize-svg': {
      width: '8px',
      height: '8px',
      marginTop: '1px',
      marginLeft: '1px',
      opacity: 0,
      display: 'none',
    },
  } as CSSObject;

  return {
    styles,
    kill() {
      unListenFocus();
      unListenBlur();
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

export function snakeToPascal(input: string) {
  return input
    .split('-')
    .map((substr) => substr.charAt(0).toUpperCase() + substr.slice(1))
    .join('');
}
