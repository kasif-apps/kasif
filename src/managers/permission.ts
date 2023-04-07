import React from 'react';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { openConfirmModal } from '@mantine/modals';
import { createRecordSlice, StorageTransactor } from '@kasif-apps/cinq';
import { kasif } from '@kasif/config/app';
import { Permissions } from '@kasif/components/Compound/Permission';

export const permissions = [
  'upload_plugin',
  'install_plugin',
  'load_plugin',
  'show_notifications',
  'push_view',
  'push_pane',
  'remove_view',
  'set_view',
  'remove_pane',
  'replace_pane',
  'push_navbar_item',
  'remove_navbar_item',
  'define_command',
  'define_setting',
  'define_setting_category',
  'define_contextmenu_item',
  'define_contextmenu_category',
  'define_contextmenu_field',
  'open_contextmenu',
  'close_contextmenu',
  'kill_network_manager',
  'kill_contextmenu_manager',
  'reinit_permission_manager',
  'reinit_command_manager',
  'reinit_auth_manager',
  'reinit_plugin_manager',
  'reinit_network_manager',
  'revoke_permission',
  'read_user_data',
  'read_connection_data',
  'read_setting',
] as const;

export type PermissionType = typeof permissions[number];

@tracker('permissionManager')
export class PermissionManager extends BaseManager {
  store = createRecordSlice<Record<string, Array<PermissionType>>>(
    { [kasif.id]: permissions as unknown as PermissionType[] },
    { key: 'permission-store' }
  );

  @trackable
  @authorized(['reinit_permission_manager'])
  init() {
    const transactor = new StorageTransactor({
      slice: this.store,
      key: 'permissions',
    });

    transactor.init();
  }

  @trackable
  async prompt(required: Array<PermissionType>) {
    return new Promise<boolean>((resolve) => {
      const allowedPermissions = this.store.get()[this.app.id];

      if (allowedPermissions) {
        let isAllowed = true;

        required.forEach((permission) => {
          if (!allowedPermissions.includes(permission)) {
            isAllowed = false;
          }
        });

        if (isAllowed) {
          resolve(true);
          return;
        }
      } else {
        this.store.setKey(this.app.id, []);
      }

      const openModal = () =>
        openConfirmModal({
          title: `${this.app.name} Asks for permission the following`,
          children: React.createElement(Permissions, { permissions: required }),
          labels: { confirm: 'Confirm', cancel: 'Cancel' },
          onCancel: () => resolve(false),
          onConfirm: () => {
            resolve(true);
            this.store.setKey(this.app.id, (oldValue) => {
              if (oldValue && oldValue.length > 0) {
                return [...oldValue, ...required];
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
    this.store.setKey(this.app.id, (oldValue) => oldValue.filter((item) => item !== permission));
  }
}
