import { createShortcutLabelFromString, trackable, tracker } from '@kasif/util/misc';
import { registerSpotlightActions } from '@mantine/spotlight';
import { BaseManager } from '@kasif/managers/base';
import { kasif } from '@kasif/config/app';
import { DisplayRenderableNode, RenderableNode } from '@kasif/util/node-renderer';
import React from 'react';
import { initCommands } from '@kasif/config/command';

export interface Command {
  id: string;
  title: string;
  shortCut?: string;
  onTrigger: () => Promise<unknown>;
  source: typeof kasif;
  icon?: React.FC | RenderableNode;
}

@tracker('commandManager')
export class CommandManager extends BaseManager {
  commands: Command[] = [];

  init() {
    initCommands();
  }

  @trackable
  defineCommand(command: Omit<Command, 'source'>) {
    this.commands.push({
      ...command,
      source: { id: this.app.id, name: this.app.name, version: this.app.version },
    });

    this.dispatchEvent(new CustomEvent('define-command', { detail: command }));
    this.app.notificationManager.log(
      `Command '${command.title}' (${command.id}) defined`,
      'Command defined'
    );

    const shortCut = command.shortCut?.toLowerCase();

    let label;
    if (shortCut) {
      label = createShortcutLabelFromString(shortCut);
    }

    registerSpotlightActions([
      {
        ...command,
        shortCut: label,
        group: 'Commands',
        icon: command.icon
          ? React.createElement(DisplayRenderableNode, { node: command.icon })
          : undefined,
      },
    ]);
  }
}
