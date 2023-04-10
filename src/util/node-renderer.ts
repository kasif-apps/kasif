import React, { useEffect, useRef, useState } from 'react';
import { LoadingOverlay, LoadingOverlayProps } from '@mantine/core';
import { TablerIconProps } from '@tabler/icons';

export function isCustomRender(node: RenderableNode | React.FC): node is CustomRender {
  return (node as CustomRender).render !== undefined;
}

export function isPrebuiltRender(node: RenderableNode | React.FC): node is PrebuiltRender {
  return (node as PrebuiltRender).type !== undefined;
}

export function NodeRenderer({ render }: CustomRender) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: () => void;
    if (ref.current) {
      cleanup = render(ref.current);
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [render, ref]);

  return React.createElement('div', {
    ref,
    style: { display: 'block', width: '100%', height: '100%' },
  });
}

export function PrebuiltRenderer(props: PrebuiltRender) {
  const [component, setComponent] = useState<null | { ReactComponent: React.FC<TablerIconProps> }>(
    null
  );

  const render = (props as PrebuiltIcon).render || '';

  useEffect(() => {
    if (props.type === 'icon' && props.render) {
      import(`../../node_modules/@tabler/icons/icons/${props.render}.svg`).then((icon) => {
        if (icon && icon.ReactComponent) {
          setComponent(icon);
        }
      });
    }
  }, [props.type, render]);

  if (props.type === 'loading-overlay') {
    return React.createElement(LoadingOverlay, {
      ...props.props,
      visible: true,
      loaderProps: { variant: 'dots' },
    });
  }

  if (!props.render || component === null) return React.createElement(React.Fragment);

  const iconProps = props.props;

  if (iconProps?.size) {
    iconProps.width = iconProps.size;
    iconProps.height = iconProps.size;
  }

  return React.createElement(component.ReactComponent, iconProps);
}

export interface CustomRender {
  render: (parent: HTMLElement) => () => void;
}

export type PrebuiltRender = PrebuiltIcon | PrebuiltLoadingOverlay;

export interface PrebuiltLoadingOverlay {
  type: 'loading-overlay';
  props: LoadingOverlayProps;
}

export interface PrebuiltIcon {
  type: 'icon';
  render?: string;
  props?: TablerIconProps;
}

export type RenderableNode = CustomRender | PrebuiltRender;

export function DisplayRenderableNode({ node }: { node: RenderableNode | React.FC }) {
  if (isPrebuiltRender(node)) {
    return React.createElement(PrebuiltRenderer, node);
  }

  if (isCustomRender(node)) {
    return React.createElement(NodeRenderer, node);
  }

  return React.createElement(node);
}
