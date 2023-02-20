import React, { useEffect, useRef, useState } from 'react';
import { MantineTransition, Transition as MantineTransitionComponent } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';

export interface TransitionController {
  mounted: boolean;
  unMount: () => Promise<unknown>;
  onUnmount: (callbackFn: () => void) => void;
}

export function useTransitionController(delay = 0): TransitionController {
  const [mounted, setMounted] = useState(false);
  const onUnMountCallback = useRef<() => void>(() => {});

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, delay);

    return () => {
      setMounted(false);
    };
  }, []);

  const unMount = () =>
    new Promise((resolve) => {
      setMounted(false);
      setTimeout(() => {
        onUnMountCallback.current();
        resolve(true);
      }, delay * 2);
    });

  const onUnmount = (callbackFn: () => void) => {
    onUnMountCallback.current = callbackFn;
  };

  return { mounted, unMount, onUnmount };
}

export interface TransitionProps {
  children: React.ReactElement;
  transition: MantineTransition;
  duration?: number;
  controller?: TransitionController;
  delay?: number;
}

export function Transition(props: TransitionProps) {
  const reducedMotion = useReducedMotion();
  const defaultController = useTransitionController(props.delay);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const controller = props.controller || defaultController;
    controller.onUnmount(() => {
      setShown(false);
    });
  }, []);

  if (!shown) {
    return null;
  }

  if (reducedMotion) {
    return props.children;
  }

  const clone = (styles: React.CSSProperties) =>
    React.cloneElement(props.children, { ...props.children.props, style: styles });

  return (
    <MantineTransitionComponent
      mounted={props.controller?.mounted ?? defaultController.mounted}
      transition={props.transition}
      duration={props.duration}
      timingFunction="ease-in-out"
    >
      {(styles) => clone(styles)}
    </MantineTransitionComponent>
  );
}
