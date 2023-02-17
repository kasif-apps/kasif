import React, { useRef, useEffect, useCallback } from 'react';
import {
  createCapturer,
  CaptureChangeEvent,
  CaptureTickEvent,
  CaptureEdgeEvent,
} from '@kasif-apps/capture';
import { useResizeObserver } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';

type CaptureOptions = Parameters<typeof createCapturer>[1];

export interface ReactCaptureOptions extends CaptureOptions {
  onCaptureTick?: (event: CustomEvent<CaptureTickEvent>) => void;
  onCaptureEnd?: (event: CustomEvent<CaptureEdgeEvent>) => void;
  onCaptureStart?: (event: CustomEvent<CaptureEdgeEvent>) => void;
}

function getCssVar(varaible: string) {
  const root = document.querySelector(':root')!;
  const style = getComputedStyle(root);
  return style.getPropertyValue(varaible);
}

export function useCapture<T extends HTMLElement>(options: ReactCaptureOptions) {
  const [ref, rect] = useResizeObserver<T>();
  const cancel = useRef<() => void>(() => {});

  useEffect(() => {
    if (ref.current) {
      const { destroy, cancel: cncl } = createCapturer(ref.current, options);
      cancel.current = cncl;

      if (options.onCaptureTick) {
        ref.current.addEventListener('capture-tick', options.onCaptureTick as EventListener);
      }

      if (options.onCaptureEnd) {
        ref.current.addEventListener('capture-end', options.onCaptureEnd as EventListener);
      }

      if (options.onCaptureStart) {
        ref.current.addEventListener('capture-start', options.onCaptureStart as EventListener);
      }

      return () => {
        destroy();

        if (ref.current) {
          ref.current.removeEventListener('capture-tick', options.onCaptureTick as EventListener);
          ref.current.removeEventListener('capture-end', options.onCaptureEnd as EventListener);
          ref.current.removeEventListener('capture-start', options.onCaptureStart as EventListener);
        }
      };
    }
  }, [ref, rect]);

  useEffect(() => {
    cancel.current();
  }, [rect]);

  return { ref, cancel: cancel.current };
}

export const CaptureTarget: React.FC<{
  id: string;
  children: React.ReactNode;
  onCaptureStateChange?: (e: CustomEvent<CaptureChangeEvent>) => void;
}> = (props) => {
  const ref = useRef<HTMLElement>(null);

  // @ts-ignore
  const copy = React.cloneElement(React.Children.only(props.children), {
    'data-capture-target': props.id,
    ref,
  });

  useEffect(() => {
    const listener = (e: CustomEvent<CaptureChangeEvent>) => {
      props.onCaptureStateChange?.(e);
    };

    if (ref.current) {
      ref.current.addEventListener('capture-state-change', listener as EventListener);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('capture-state-change', listener as EventListener);
      }
    };
  }, [ref.current]);

  return copy;
};

export function useCaptureField() {
  const theme = useMantineTheme();
  const ref = useRef<HTMLDivElement>(document.createElement('div'));
  const root = document.querySelector('body div#root') as HTMLElement;

  const setSource = (source: HTMLElement | null) => {
    if (source) {
      const handleCaptureStart = (() => {
        if (source && ref.current) {
          source.appendChild(ref.current);
        }
      }) as EventListener;

      const handleCaptureEnd = (() => {
        if (source && ref.current) {
          // source.removeChild(ref.current);
        }
      }) as EventListener;

      source.addEventListener('capture-start', handleCaptureStart);
      source.addEventListener('capture-end', handleCaptureEnd);

      return () => {
        source.removeEventListener('capture-start', handleCaptureStart);
        source.removeEventListener('capture-end', handleCaptureEnd);
      };
    }
  };

  const onCaptureTick = useCallback(
    (event: CustomEvent<CaptureTickEvent>) => {
      if (ref.current && event.detail.updated) {
        const leftBuffer = parseInt(getCssVar('--mantine-navbar-width'), 10);
        const topBuffer = parseInt(getCssVar('--mantine-header-height'), 10);

        const { area } = event.detail;
        const style = {
          left: `${area.topLeft.x - leftBuffer}px`,
          top: `${area.topLeft.y - topBuffer}px`,
          width: `${area.width}px`,
          height: `${area.height}px`,
        };

        Object.assign(ref.current.style, style);
      }
    },
    [ref.current]
  );

  const onCaptureStart = useCallback(() => {
    const style = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: '99999',
      border: '1px solid',
      borderRadius: `${theme.radius.xs}px`,
      backgroundColor: theme.fn.rgba(theme.colors[theme.primaryColor][5], 0.1),
      borderColor: theme.fn.rgba(theme.colors[theme.primaryColor][5], 0.2),
    };

    Object.assign(ref.current.style, style);
    root.style.cursor = 'crosshair';
  }, [ref.current]);

  const onCaptureEnd = useCallback(() => {
    if (ref.current) {
      const style = {
        lefy: '0px',
        top: '0px',
        width: '0px',
        height: '0px',
        border: 'none',
      };

      root.style.cursor = 'auto';
      Object.assign(ref.current.style, style);
    }
  }, [ref.current]);

  return {
    onCaptureTick,
    onCaptureStart,
    onCaptureEnd,
    setSource,
  };
}
