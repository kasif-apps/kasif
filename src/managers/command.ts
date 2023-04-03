import { createShortcutLabel, trackable, tracker } from '@kasif/util/misc';
import { registerSpotlightActions } from '@mantine/spotlight';
import { BaseManager } from '@kasif/managers/base';
import { kasif } from '@kasif/config/app';

export interface Command {
  id: string;
  title: string;
  shortCut?: string;
  onTrigger: () => void;
  source: typeof kasif;
}

@tracker('commandManager')
export class CommandManager extends BaseManager {
  commands: Command[] = [];

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
      label = createShortcutLabel(...shortCut.split('+').map((key) => key.trim()));
    }

    registerSpotlightActions([
      {
        ...command,
        shortCut: label,
        group: 'Commands',
      },
    ]);
  }
}
