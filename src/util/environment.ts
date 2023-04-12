import { app } from '@kasif/config/app';
import { fs as tauriFs, path as tauriPath } from '@tauri-apps/api';

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
  readTextFile: (path: string, options?: FsOptions) => Promise<string>;
  readDir: (path: string) => Promise<FileEntry[]>;
}

export class Environment {
  currentEnvironment: 'web' | 'desktop';
  fs: Fs;
  path: Path;

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
      writeBinaryFile: NoOp,
      readTextFile: NoOp,
      readDir: NoOp,
    };

    this.init();
  }

  init() {
    const originalIPC = window.__TAURI_IPC__ as ((message: any) => void) | undefined;

    try {
      if (originalIPC) {
        this.fs = tauriFs;
        this.path = tauriPath;
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
}

export const environment = new Environment();
