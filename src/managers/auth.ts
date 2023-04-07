import { createSlice, Slice } from '@kasif-apps/cinq';
import { backend } from '@kasif/config/backend';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { BaseManager } from './base';

export interface User {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: Date;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: Date;
  username: string;
  verified: boolean;
}

@tracker('authManager')
export class AuthManager extends BaseManager {
  #user: Slice<User | null> = createSlice(null, { key: 'user' }) as Slice<User | null>;
  avatar: Slice<string> = this.#user.derive(
    (user) => {
      if (user) {
        return backend.getFileUrl(user, user.avatar);
      }

      return '';
    },
    { key: 'user-avatar' }
  );

  @trackable
  @authorized(['reinit_auth_manager'])
  init() {
    this.#user.set(backend.authStore.model as User | null);

    backend.authStore.onChange((_, record) => {
      this.#user.set(record as User | null);
    });
  }

  @trackable
  // @authorized(['read_user_data'])
  getUserSnaphot() {
    return this.#user.get();
  }

  @trackable
  // @authorized(['read_user_data'])
  getUserSlice() {
    return this.#user;
  }
}
