import { app } from '@kasif/config/app';
import { fs } from '@tauri-apps/api';

export class Tauri {
  constructor() {
    this.init();
  }

  init() {
    const originalIPC = window.__TAURI_IPC__;

    try {
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

  fs = fs;
}

export const tauri = new Tauri();
