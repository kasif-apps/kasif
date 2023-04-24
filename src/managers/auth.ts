import { backend } from '@kasif/config/backend';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';

import { Slice, createSlice } from '@kasif-apps/cinq';

export interface UserDTO {
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

export class User {
  constructor(public data: UserDTO) {}

  get displayName() {
    if (this.data.name.length > 0) {
      return this.data.name;
    }

    return this.data.username;
  }

  get avatar() {
    if (this.data.avatar) {
      return backend.getFileUrl(this.data, this.data.avatar);
    }

    return '/icon-contained.png';
  }
}

@tracker('authManager')
export class AuthManager extends BaseManager {
  #user: Slice<User | null> = createSlice(null, { key: 'user' }) as Slice<User | null>;
  avatar: Slice<string> = this.#user.derive(
    user => {
      if (user) {
        return user.avatar;
      }

      return '';
    },
    { key: 'user-avatar' }
  );

  @trackable
  @authorized(['reinit_auth_manager'])
  init() {
    this.#user.set(
      backend.authStore.model ? new User(backend.authStore.model as unknown as UserDTO) : null
    );

    backend.authStore.onChange(() => {
      this.#user.set(
        backend.authStore.model ? new User(backend.authStore.model as unknown as UserDTO) : null
      );
    });
  }

  @trackable
  @authorized(['read_user_data'])
  getUserSnaphot() {
    return this.#user.get();
  }

  @trackable
  @authorized(['read_user_data'])
  getUserSlice() {
    return this.#user;
  }
}
