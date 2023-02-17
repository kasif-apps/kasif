import { createShortcutLabel } from '@kasif/util/misc';
import { registerSpotlightActions } from '@mantine/spotlight';

export interface Command {
  id: string;
  title: string;
  shortCut?: string;
  onTrigger: () => void;
}

export class CommandManager extends EventTarget {
  commands: Command[] = [];

  defineCommand(command: Command) {
    this.commands.push(command);

    this.dispatchEvent(new CustomEvent('define-command', { detail: command }));

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
