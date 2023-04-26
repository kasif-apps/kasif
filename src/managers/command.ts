import React from 'react';

import { registerSpotlightActions } from '@mantine/spotlight';

import { app, kasif } from '@kasif/config/app';
import { initCommands } from '@kasif/config/command';
import { LocaleString } from '@kasif/config/i18n';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { createShortcutLabelFromString } from '@kasif/util/misc';
import { DisplayRenderableNode, RenderableNode } from '@kasif/util/node-renderer';

import { createVectorSlice } from '@kasif-apps/cinq';

export interface Command {
  id: string;
  title: LocaleString;
  shortCut?: string;
  onTrigger: () => Promise<unknown>;
  source: typeof kasif;
  icon?: RenderableNode;
}

@tracker('commandManager')
export class CommandManager extends BaseManager {
  commands = createVectorSlice<Command[]>([], { key: 'commands' });

  init() {
    initCommands();
  }

  @trackable
  @authorized(['define_command'])
  defineCommand(command: Omit<Command, 'source'>) {
    this.commands.push({
      ...command,
      source: {
        id: this.app.id,
        name: this.app.name,
        version: this.app.version,
      },
    });

    this.dispatchEvent(new CustomEvent('define-command', { detail: command }));
    this.app.notificationManager.log(
      `Command '${command.title}' (${command.id}) defined`,
      'Command defined'
    );

    const shortCut = command.shortCut?.toLocaleLowerCase();

    let label;
    if (shortCut) {
      label = createShortcutLabelFromString(shortCut);
    }

    registerSpotlightActions([
      {
        ...command,
        shortCut: label,
        group: 'Commands',
        title: app.localeManager.getI18nValue(command.title),
        icon: command.icon
          ? React.createElement(DisplayRenderableNode, { node: command.icon })
          : undefined,
      },
    ]);
  }
}
