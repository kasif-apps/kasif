import React, { useEffect, useRef } from 'react';

export function NodeRenderer({ node }: { node: RenderableNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: () => void;
    if (ref.current) {
      cleanup = node.render(ref.current);
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [node, ref]);

  return React.createElement('div', {
    ref,
    style: { display: 'block', width: '100%', height: '100%' },
  });
}

export interface RenderableNode {
  render: (parent: HTMLElement) => () => void;
}

export function isRenderableNode(node: RenderableNode | React.FC): node is RenderableNode {
  return (node as RenderableNode).render !== undefined;
}

export function DisplayRenderableNode({ node }: { node: RenderableNode | React.FC }) {
  if (isRenderableNode(node)) {
    return React.createElement(NodeRenderer, { node });
  }

  return React.createElement(node);
}
