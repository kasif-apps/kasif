import React from 'react';
import { createRecordSlice, RecordSlice, StorageTransactor } from '@kasif-apps/cinq';
import { initialCategories, initialSettings } from '@kasif/config/settings';
import { BaseManager } from '@kasif/managers/base';
import { RenderableNode } from '@kasif/util/node-renderer';
import { App } from '@kasif/config/app';
import { trackable, tracker } from '@kasif/util/misc';

export interface SettingCategory {
  id: string;
  title: string;
  description: string;
  color?: string;
}

export interface SettingsItem<T> {
  id: string;
  category: SettingCategory['id'];
  title: string;
  description: string;
  value: T;
  render: React.FC | RenderableNode;
}

export interface SettingController<T> {
  id: SettingsItem<T>['id'];
  instance: RecordSlice<SettingsItem<T>>;
  category: SettingsItem<T>['category'];
  update: (value: T) => void;
}

export interface SettingsStore {
  items: SettingsItem<any>[];
}

@tracker('settingsManager')
export class SettingsManager extends BaseManager {
  controllers: SettingController<any>[] = [];
  categories: SettingCategory[] = [];

  constructor(app: App, parent?: App) {
    super(app, parent);

    if (!parent) {
      initialCategories.forEach((category) => this.defineCategory(category));
      initialSettings.forEach((setting) => this.defineSetting(setting));
    }
  }

  @trackable
  defineSetting<T>(item: SettingsItem<T>) {
    if (this.getSettingController(item.id)) {
      this.app.notificationManager.error(
        `Setting with id ${item.id} already exists.`,
        'Cannot Define Setting'
      );
      return;
    }

    const slice = createRecordSlice(item, { key: `kasif.${item.id}` });

    const controller = {
      id: item.id,
      instance: slice,
      update: (value: T) => {
        const oldValue = slice.get().value;
        slice.upsert({ ...item, value });
        this.app.notificationManager.log(
          `Setting '${item.title}' (${item.id}) updated`,
          'Setting Updated'
        );
        this.dispatchEvent(
          new CustomEvent('update-setting', {
            detail: { id: item.id, oldValue, newValue: value, controller },
          })
        );
      },
      category: item.category,
    };

    const transactor = new StorageTransactor({
      key: 'settings',
      slice,
      type: 'localStorage',
      model: {
        encode: (data) => JSON.stringify(data.get().value),
        decode: (data) => ({ ...item, value: JSON.parse(data) }),
      },
    });

    transactor.init();

    this.controllers.push(controller);
    this.dispatchEvent(new CustomEvent('define-setting', { detail: controller }));

    setTimeout(() => {
      this.app.notificationManager.log(
        `Setting '${item.title}' (${item.id}) defined`,
        'Setting Defined'
      );
    });
  }

  @trackable
  defineCategory(category: SettingCategory) {
    if (this.categories.find((c) => c.id === category.id)) {
      this.app.notificationManager.error(
        `Category with id ${category.id} already exists.`,
        'Cannot Define Category'
      );
      return;
    }

    this.categories.push(category);
    this.dispatchEvent(new CustomEvent('define-category', { detail: category }));

    setTimeout(() => {
      this.app.notificationManager.log(
        `Category '${category.title}' (${category.id}) defined`,
        'Category Defined'
      );
    });
  }

  getSettingController<T>(id: SettingsItem<T>['id']): SettingController<T> | undefined {
    const result = this.controllers.find((controller) => controller.id === id);

    return result as SettingController<T>;
  }

  getSetting<T>(id: SettingsItem<T>['id']): T | undefined {
    const theme = this.app.settingsManager.getSettingController<T>(id);

    if (theme) {
      return theme.instance.get().value;
    }
  }
}
