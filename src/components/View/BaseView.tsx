import React, { useEffect } from 'react';
import { CaptureEdgeEvent, getCapturedTargets } from '@kasif-apps/capture';
import { app } from '@kasif/config/app';
import { useCaptureField, useCapture, CaptureTarget } from '@kasif/util/capture-react';
import { useSlice } from '@kasif/util/cinq-react';
import { Box, createStyles, Stack, UnstyledButton } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { Toolbar } from '@kasif/components/View/Toolbar';

const useStyles = createStyles((theme) => ({
  item: {
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
    },

    '&.selected, &[data-captured="true"]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3],
    },

    '&.cut': {
      opacity: 0.5,
    },
  },
}));

export interface BaseViewItemProps {
  id: string;
  children: React.ReactNode;
}

export function BaseViewItem(props: BaseViewItemProps) {
  const { classes, cx } = useStyles();
  const [selected] = useSlice(app.contentManager.selection);
  const [cut] = useSlice(app.contentManager.cut);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (e.shiftKey) {
      if (selected.includes(props.id)) {
        app.contentManager.deselect(props.id);
      } else {
        app.contentManager.select(props.id);
      }
    } else {
      app.contentManager.set([props.id]);
    }
  };

  return (
    <CaptureTarget id={props.id}>
      <UnstyledButton
        className={cx(
          classes.item,
          selected.includes(props.id) && 'selected',
          cut.includes(props.id) && 'cut'
        )}
        data-non-capture-source
        onClick={handleClick}
      >
        {props.children}
      </UnstyledButton>
    </CaptureTarget>
  );
}

export function BaseView(props: { children: React.ReactElement; items: string[] }) {
  const { onCaptureEnd, onCaptureStart, onCaptureTick, setSource } = useCaptureField();
  const selection = useSlice(app.contentManager.selection);

  useHotkeys([
    [
      'mod+a',
      () => {
        app.contentManager.selectAll(props.items);
      },
    ],
    [
      'mod+d',
      () => {
        app.contentManager.deselectAll();
      },
    ],
    [
      'mod+x',
      () => {
        app.contentManager.cutSelection();
      },
    ],
    [
      'mod+c',
      () => {
        app.contentManager.copySelection();
      },
    ],
    [
      'mod+v',
      () => {
        app.contentManager.paste();
      },
    ],
    ['mod+s', () => {}],
  ]);

  const handleCaptureStart = (e: CustomEvent<CaptureEdgeEvent>) => {
    onCaptureStart();

    if (!e.detail.mouseEvent.shiftKey) {
      app.contentManager.deselectAll();
    }
  };

  const handleCaptureEnd = (e: CustomEvent<CaptureEdgeEvent>) => {
    onCaptureEnd();
    const selected = getCapturedTargets().map((target) => target.id);

    if (e.detail.mouseEvent.shiftKey) {
      app.contentManager.selectMultiple(selected);
    } else {
      app.contentManager.set(selected);
    }
  };

  const { ref } = useCapture<HTMLDivElement>({
    onCaptureStart: handleCaptureStart,
    onCaptureEnd: handleCaptureEnd,
    onCaptureTick,
    constrain: true,
    manuelCommit: true,
  });

  useEffect(() => {
    ref.current?.dispatchEvent(new CustomEvent('capture-commit'));
  }, [selection]);

  useEffect(() => {
    setSource(ref.current);
  }, [ref.current]);

  return (
    <Stack sx={{ height: '100%' }} spacing="sm">
      <Toolbar />
      <Box
        ref={ref}
        sx={{
          flex: 1,
          maxWidth: 'calc(100vw - var(--mantine-navbar-width))',
          width: 'auto',
          position: 'relative',
        }}
      >
        {/* this doesn't work with refs */}
        {/* <Transition transition="fade">{props.children}</Transition> */}
        {props.children}
      </Box>
    </Stack>
  );
}
