import React from 'react';

import { openConfirmModal } from '@mantine/modals';

import { Permissions } from '@kasif/components/Compound/Permission';
import { kasif } from '@kasif/config/app';
import { PermissionType, permissions } from '@kasif/config/permission';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { FSTransactor, environment } from '@kasif/util/environment';

import { StorageTransactor, createRecordSlice, createSlice } from '@kasif-apps/cinq';

@tracker('permissionManager')
export class PermissionManager extends BaseManager {
  store = createRecordSlice<Record<string, Array<PermissionType>>>(
    { [kasif.id]: permissions as unknown as PermissionType[] },
    { key: 'permission-store' }
  );
  ready = createSlice(false, { key: 'permissions-ready-state' });

  @trackable
  @authorized(['reinit_permission_manager'])
  init() {
    if (environment.currentEnvironment === 'desktop') {
      environment.path.appLocalDataDir().then(async dir => {
        const path = await environment.path.join(dir, 'permissions.json');

        const transactor = new FSTransactor({
          slice: this.store,
          key: 'permissions',
          path,
        });
        transactor.init();
        this.ready.set(true);
      });
    } else {
      const transactor = new StorageTransactor({
        slice: this.store,
        key: 'permissions',
      });

      transactor.init();
      this.ready.set(true);
    }
  }

  @trackable
  // @authorized(['read_permission_data'])
  getMissingPermissions(required: Array<PermissionType>): Array<PermissionType> {
    return this.#getMissingPermissions(required);
  }

  #getMissingPermissions(required: Array<PermissionType>): Array<PermissionType> {
    const allowedPermissions = this.store.get()[this.app.id];

    if (allowedPermissions) {
      const missingPermissions: Array<PermissionType> = [];

      required.forEach(permission => {
        if (!allowedPermissions.includes(permission)) {
          missingPermissions.push(permission);
        }
      });

      return missingPermissions;
    }

    return required;
  }

  @trackable
  async prompt(required: Array<PermissionType>) {
    return new Promise<boolean>(resolve => {
      const allowedPermissions = this.store.get()[this.app.id];
      const missingPermissions = this.#getMissingPermissions(required);

      if (!allowedPermissions) {
        this.store.setKey(this.app.id, []);
      }

      const { id, name } = this.app;
      const openModal = () =>
        openConfirmModal({
          title: `${name} asks for permission of the following`,
          children: React.createElement(Permissions, { permissions: missingPermissions }),
          labels: { confirm: 'Confirm', cancel: 'Cancel' },
          onCancel: () => resolve(false),
          onConfirm: () => {
            resolve(true);
            this.store.setKey(id, oldValue => {
              if (oldValue && oldValue.length > 0) {
                return Array.from(new Set([...oldValue, ...required]));
              }

              return required;
            });
          },
        });

      openModal();
    });
  }

  @trackable
  @authorized(['revoke_permission'])
  revoke(permission: PermissionType) {
    this.store.setKey(this.app.id, oldValue => oldValue.filter(item => item !== permission));
  }
}
