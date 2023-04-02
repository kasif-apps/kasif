import { createShortcutLabel, trackable, tracker } from '@kasif/util/misc';
import { registerSpotlightActions } from '@mantine/spotlight';
import { BaseManager } from '@kasif/managers/base';

export interface Command {
  id: string;
  title: string;
  shortCut?: string;
  onTrigger: () => void;
}

@tracker('commandManager')
export class CommandManager extends BaseManager {
  commands: Command[] = [];

  @trackable
  defineCommand(command: Command) {
    this.commands.push(command);

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
