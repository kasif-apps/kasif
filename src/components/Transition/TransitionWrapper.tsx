import * as React from 'react';

import { MantineTransition, Transition } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';

export function useTransition(amount = 50, id = '') {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, amount);

    return () => {
      setMounted(false);
    };
  }, []);

  React.useEffect(() => {
    setMounted(false);
    setTimeout(() => {
      setMounted(true);
    }, amount);
  }, [id]);

  const unMount = () =>
    new Promise((resolve) => {
      setMounted(false);
      setTimeout(() => resolve(true), amount * 2);
    });

  return { mounted, unMount };
}

export function TransitionWrapper({
  children,
  transition,
  duration = 200,
  mounted = undefined,
}: {
  children(styles?: React.CSSProperties): React.ReactElement;
  transition: MantineTransition;
  duration?: number;
  mounted?: boolean;
}) {
  const { mounted: m } = useTransition();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return children();
  }

  return (
    <Transition
      mounted={mounted ?? m}
      transition={transition}
      duration={duration}
      timingFunction="ease-in-out"
    >
      {(styles) => children(styles)}
    </Transition>
  );
}
