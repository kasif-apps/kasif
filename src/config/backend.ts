import { environment } from '@kasif/util/environment';

import PocketBase, { BaseAuthStore, LocalAuthStore, Record } from 'pocketbase';

export interface BackendError {
  response: {
    code: number;
    message: string;
    data: object;
  };
}

export class FsAuthStore extends BaseAuthStore {
  path?: string;

  constructor() {
    super();
    environment.path.appLocalDataDir().then(async dir => {
      const path = await environment.path.join(dir, 'user.json');
      this.path = path;

      const exists = await environment.fs.exists(path);

      if (!exists) {
        await environment.fs.writeTextFile(path, '{}');
      } else {
        const raw = await environment.fs.readTextFile(path);
        const user = JSON.parse(raw);

        if (user.token) {
          super.save(user.token, user.model);
        }
      }
    });
  }

  async save(token: string, model: Record) {
    if (this.path) {
      await environment.fs.writeTextFile(this.path, JSON.stringify({ token, model }));
      super.save(token, model);
    }
  }

  async clear() {
    if (this.path) {
      environment.fs.removeFile(this.path);
      super.clear();
    }
  }
}

export const backend = new PocketBase(
  import.meta.env.VITE_REACT_API_URL,
  environment.currentEnvironment === 'desktop' ? new FsAuthStore() : new LocalAuthStore()
);
