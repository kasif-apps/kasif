import React, { useEffect, useRef } from 'react';

export function NodeRenderer({ node }: { node: HTMLElement }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      Array.from(ref.current.children).forEach((child) => child.remove());
      ref.current.appendChild(node);
    }
  }, [node]);

  return React.createElement('div', { ref });
}

export interface RenderableNode {
  display(): HTMLElement;
}
