import { CSSObject, MantineTheme } from '@mantine/core';

export function createPaneStyles(theme: MantineTheme): CSSObject {
  const border = theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0];
  const borderHover = theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1];

  return {
    '.SplitPane': { left: 'var(--mantine-navbar-width) !important' },

    '.Resizer': {
      background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
      zIndex: 1,
      boxSizing: 'border-box',
      backgroundClip: 'padding-box',
    },
    '.Resizer:hover': {
      transition: 'all 2s ease',
    },
    '.Resizer.horizontal': {
      height: '7px',
      margin: '-3px 0',
      borderTop: '3px solid',
      borderBottom: '3px solid',
      borderColor: border,
      cursor: 'row-resize',
      width: '100%',
    },
    '.Resizer.horizontal:hover': {
      borderTop: '3px solid',
      borderBottom: '3px solid',
      borderColor: borderHover,
    },
    '.Resizer.vertical': {
      width: '7px',
      margin: '0 -3px',
      borderLeft: '3px solid',
      borderRight: '3px solid',
      borderColor: border,
      cursor: 'col-resize',
    },
    '.Resizer.vertical:hover': {
      borderLeft: '3px solid',
      borderRight: '3px solid',
      borderColor: borderHover,
    },
    '.Resizer.disabled': {
      cursor: 'not-allowed',
    },
    '.Resizer.disabled:hover': {
      borderColor: 'transparent',
    },
  };
}
