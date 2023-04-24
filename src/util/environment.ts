import { app } from '@kasif/config/app';

import { getOS } from './misc';

import { Transactor } from '@kasif-apps/cinq';
import { TransactorOptions } from '@kasif-apps/cinq/dist/src/lib/transactor/base/transactor';
import { invoke, fs as tauriFs, path as tauriPath } from '@tauri-apps/api';
import { getMatches as getArgMatches } from '@tauri-apps/api/cli';
import { OpenDialogOptions, open } from '@tauri-apps/api/dialog';
import { EventCallback, EventName, UnlistenFn, listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';

async function NoOp<T>(): Promise<T> {
  return 'no-op' as unknown as T;
}

interface Path {
  join: (...path: string[]) => Promise<string>;
  resolveResource: (resource: string) => Promise<string>;
  basename: (name: string) => Promise<string>;
  appLocalDataDir: () => Promise<string>;
  BaseDirectory: {
    AppLocalData: number;
    Document: number;
  };
}

interface FsOptions {
  dir: number;
}

interface FileEntry {
  name?: string;
}

interface Fs {
  copyFile: (source: string, target: string) => Promise<void>;
  writeBinaryFile: (path: string, contents: ArrayBuffer, options?: FsOptions) => Promise<void>;
  writeTextFile: (path: string, contents: string, options?: FsOptions) => Promise<void>;
  readTextFile: (path: string, options?: FsOptions) => Promise<string>;
  removeFile: (file: string, options?: FsOptions | undefined) => Promise<void>;
  readDir: (path: string) => Promise<FileEntry[]>;
  exists: (path: string, options?: FsOptions | undefined) => Promise<boolean>;
}

interface Dialog {
  open: (options?: OpenDialogOptions) => Promise<null | string | string[]>;
}

interface EnvironmentEvent {
  listen: <T>(event: EventName, handler: EventCallback<T>) => Promise<UnlistenFn>;
}

export class Environment {
  currentEnvironment: 'web' | 'desktop';
  fs: Fs;
  path: Path;
  dialog: Dialog;
  event: EnvironmentEvent;
  invoke: typeof invoke;
  getArgMatches: typeof getArgMatches;
  appWindow?: typeof appWindow;

  constructor() {
    this.currentEnvironment = 'web';

    this.path = {
      join: NoOp,
      resolveResource: NoOp,
      basename: NoOp,
      appLocalDataDir: NoOp,
      BaseDirectory: {
        AppLocalData: 0,
        Document: 0,
      },
    };

    this.fs = {
      copyFile: NoOp,
      writeTextFile: NoOp,
      writeBinaryFile: NoOp,
      removeFile: NoOp,
      readTextFile: NoOp,
      readDir: NoOp,
      exists: NoOp,
    };

    this.dialog = {
      open: NoOp,
    };

    this.event = {
      listen: NoOp,
    };

    this.invoke = NoOp;
    this.getArgMatches = NoOp;

    this.init();
  }

  init() {
    const originalIPC = window.__TAURI_IPC__ as ((message: any) => void) | undefined;

    try {
      if (originalIPC) {
        this.fs = tauriFs;
        this.path = tauriPath;
        this.dialog = { open };
        this.event = { listen };
        this.invoke = invoke;
        this.getArgMatches = getArgMatches;
        this.appWindow = appWindow;
        this.currentEnvironment = 'desktop';
      }

      window.__TAURI_IPC__ = (message: any) => {
        if (originalIPC) {
          originalIPC(message);
        } else {
          app.notificationManager.error(
            'Desktop app is required for this part of the app',
            'Desktop Environment Missing'
          );
        }
      };
    } catch (error) {
      return 'no-op';
    }
  }

  fontDir() {
    if (this.currentEnvironment === 'desktop') {
      const os = getOS();

      if (os === 'macos') {
        return Promise.resolve('/System/Library/Fonts/Supplemental');
      }

      return tauriPath.fontDir();
    }

    return Promise.resolve('');
  }
}

export const environment = new Environment();

export interface FSTransactorOptions<T, K, L> extends TransactorOptions<T, K, L> {
  path: string;
}

export class FSTransactor<T> extends Transactor<T> {
  constructor(public options: FSTransactorOptions<T, any, any>) {
    super(options);
  }

  init(): void {
    super.init();

    environment.fs.exists(this.options.path).then(async exists => {
      if (!exists) {
        this.set();
      } else {
        this.load();
      }
    });

    this.slice.subscribe(() => {
      this.set();
    });
  }

  async set() {
    await environment.fs.writeTextFile(this.options.path, this.encode());
  }

  async load() {
    const record = await environment.fs.readTextFile(this.options.path);
    this.decode(record);
  }

  kill() {
    environment.fs.removeFile(this.options.path);
  }
}
