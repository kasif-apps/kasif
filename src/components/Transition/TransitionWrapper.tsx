import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { MantineTransition, Transition as MantineTransitionComponent } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';

import { useSetting } from '@kasif/config/app';

export interface TransitionController {
  mounted: boolean;
  unMount: () => Promise<unknown>;
  onUnmount: (callbackFn: () => void) => void;
  onMount: (callbackFn: () => void) => void;
}

export function useTransitionController(delay = 0): TransitionController {
  const [mounted, setMounted] = useState(false);
  const onUnMountCallback = useRef<() => void>(() => {});
  const onMountCallback = useRef<() => void>(() => {});
  const computedDelay = useSetting('enable-animations')[0].value ? delay : 0;

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, computedDelay);

    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      onMountCallback.current();
    }
  }, [mounted]);

  const unMount = () =>
    new Promise(resolve => {
      setMounted(false);
      setTimeout(() => {
        onUnMountCallback.current();
        resolve(true);
      }, computedDelay * 2);
    });

  const onUnmount = (callbackFn: () => void) => {
    onUnMountCallback.current = callbackFn;
  };

  const onMount = (callbackFn: () => void) => {
    onMountCallback.current = callbackFn;
  };

  return { mounted, unMount, onUnmount, onMount };
}

export interface TransitionProps {
  children: React.ReactElement;
  transition: MantineTransition;
  duration?: number;
  controller?: TransitionController;
  delay?: number;
}

export const Transition = forwardRef((props: TransitionProps, ref) => {
  const reducedMotion = useReducedMotion();
  const defaultController = useTransitionController(props.delay);
  const [shown, setShown] = useState(true);
  const [enableAnimations] = useSetting('enable-animations');

  useEffect(() => {
    const controller = props.controller || defaultController;
    controller.onUnmount(() => {
      setShown(false);
    });
  }, []);

  if (!shown) {
    return null;
  }

  if (reducedMotion || !enableAnimations.value) {
    return props.children;
  }

  const clone = (styles: React.CSSProperties) =>
    React.cloneElement(
      props.children,
      {
        ...props.children.props,
        style: { ...(props.children.props.style || {}), ...styles },
        ref,
      },
      props.children.props.children
    );

  return (
    <MantineTransitionComponent
      mounted={props.controller?.mounted ?? defaultController.mounted}
      transition={props.transition}
      duration={props.duration}
      timingFunction="ease-in-out">
      {styles => clone(styles)}
    </MantineTransitionComponent>
  );
});
