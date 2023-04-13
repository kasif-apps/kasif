import { CSSObject, MantineTheme } from '@mantine/core';

export function createPaneStyles(theme: MantineTheme): CSSObject {
  const borderHover = theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1];

  return {
    '.react-split': {
      flex: 1,
      height: '100%',
      position: 'relative',
      width: '100%',
    },

    '.react-split__pane': {
      height: '100%',
      position: 'absolute',
      whiteSpace: 'normal',
      width: '100%',
      overflow: 'hidden',
    },

    '.react-split__sash': {
      height: '100%',
      position: 'absolute',
      top: '0',
      transition: 'background-color 0.1s',
      width: '100%',
      zIndex: 2,
      backgroundColor: borderHover,
    },

    '.react-split__sash--disabled': { pointerEvents: 'none' },

    '.react-split__sash--vertical': { cursor: 'col-resize' },

    '.react-split__sash--horizontal': { cursor: 'row-resize' },

    '.react-split__sash-content': { width: '100%', height: '100%' },

    '.react-split__sash-content--active': { backgroundColor: '#175ede' },

    '.react-split--dragging.react-split--vertical': { cursor: 'col-resize' },

    '.react-split--dragging.react-split--horizontal': { cursor: 'row-resize' },

    'body.react-split--disabled': { userSelect: 'none' },

    '.split-sash-content': { width: '100%', height: '100%' },
  };
}
