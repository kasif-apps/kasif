import * as Tauri from '@tauri-apps/api';

const { invoke } = Tauri;
const { appWindow } = Tauri.window;

export interface WatchOptions {
  recursive?: boolean;
}

export interface DebouncedWatchOptions extends WatchOptions {
  delayMs?: number;
}

export interface RawEvent {
  path: string | null;
  operation: number;
  cookie: number | null;
}

export type DebouncedEvent =
  | { type: 'NoticeWrite'; payload: string }
  | { type: 'NoticeRemove'; payload: string }
  | { type: 'Create'; payload: string }
  | { type: 'Write'; payload: string }
  | { type: 'Chmod'; payload: string }
  | { type: 'Remove'; payload: string }
  | { type: 'Rename'; payload: string }
  | { type: 'Rescan'; payload: void }
  | { type: 'Error'; payload: { error: string; path: string | null } };

async function unwatch(id: number): Promise<void> {
  await invoke('plugin:fs-watch|unwatch', { id });
}

export async function watch(
  paths: string | string[],
  options: DebouncedWatchOptions,
  cb: (event: DebouncedEvent) => void
) {
  const opts = {
    recursive: false,
    delayMs: 2000,
    ...options,
  };
  let watchPaths;
  if (typeof paths === 'string') {
    watchPaths = [paths];
  } else {
    watchPaths = paths;
  }

  const id = window.crypto.getRandomValues(new Uint32Array(1))[0];

  await invoke('plugin:fs-watch|watch', {
    id,
    paths: watchPaths,
    options: opts,
  });

  const unlisten = await appWindow.listen<DebouncedEvent>(
    `watcher://debounced-event/${id}`,
    (event: { payload: DebouncedEvent }) => {
      cb(event.payload);
    }
  );

  return async () => {
    await unwatch(id);
    await unlisten();
  };
}

export async function watchImmediate(
  paths: string | string[],
  options: WatchOptions,
  cb: (event: RawEvent) => void
) {
  const opts = {
    recursive: false,
    ...options,
    delayMs: null,
  };
  let watchPaths;
  if (typeof paths === 'string') {
    watchPaths = [paths];
  } else {
    watchPaths = paths;
  }

  const id = window.crypto.getRandomValues(new Uint32Array(1))[0];

  await invoke('plugin:fs-watch|watch', {
    id,
    paths: watchPaths,
    options: opts,
  });

  const unlisten = await appWindow.listen<RawEvent>(
    `watcher://raw-event/${id}`,
    (event: { payload: RawEvent }) => {
      cb(event.payload);
    }
  );

  return async () => {
    await unwatch(id);
    unlisten();
  };
}
