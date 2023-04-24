import React from 'react';

import { Stack } from '@mantine/core';
import { modals, openConfirmModal } from '@mantine/modals';

import { InputPrompt } from '@kasif/components/Compound/InputPrompt';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { DisplayRenderableNode, RenderableNode } from '@kasif/util/node-renderer';

@tracker('promptManager')
export class PromptManager extends BaseManager {
  @trackable
  @authorized(['show_prompts'])
  input(title: string): [Promise<string | undefined>, string] {
    const id = crypto.randomUUID();

    const promise = new Promise<string | undefined>(resolve => {
      modals.open({
        title: `${this.app.name} asks`,
        children: React.createElement(InputPrompt, {
          title,
          onSubmit: (value: string) => {
            resolve(value);
            modals.closeAll();
            this.dispatchEvent(new CustomEvent('submit', { detail: { id } }));
          },
        }),
        onClose: () => {
          resolve(undefined);
          this.dispatchEvent(new CustomEvent('close', { detail: { id } }));
        },
      });

      this.dispatchEvent(new CustomEvent('show-input', { detail: { title, id } }));
    });

    return [promise, id];
  }

  @trackable
  @authorized(['show_prompts'])
  confirm(
    title: string,
    content: RenderableNode = () => React.createElement('p')
  ): [Promise<boolean>, string] {
    const id = crypto.randomUUID();

    const promise = new Promise<boolean>(resolve => {
      openConfirmModal({
        title: `${this.app.name} asks`,
        children: React.createElement(
          Stack,
          null,
          title,
          React.createElement(DisplayRenderableNode, { node: content })
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => {
          resolve(false);
          this.dispatchEvent(new CustomEvent('cancel', { detail: { id } }));
        },
        onClose: () => {
          resolve(false);
          this.dispatchEvent(new CustomEvent('close', { detail: { id } }));
        },
        onConfirm: () => {
          resolve(true);
          this.dispatchEvent(new CustomEvent('confirm', { detail: { id } }));
        },
      });

      this.dispatchEvent(new CustomEvent('show-confirm', { detail: { title, id } }));
    });

    return [promise, id];
  }
}
