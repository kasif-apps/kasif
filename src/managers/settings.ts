import React from 'react';
import { createRecordSlice, RecordSlice, StorageTransactor } from '@kasif-apps/cinq';
import { initialSettings } from '@kasif/config/settings';
import { BaseManager } from '@kasif/managers/base';

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
  render: React.FC;
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

export class SettingsManager extends BaseManager {
  controllers: SettingController<any>[] = [];
  categories: SettingCategory[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Change the appearance of the app.',
      color: 'orange',
    },
    {
      id: 'layout',
      title: 'Layout',
      description: 'Change the basic layout of the app.',
      color: 'cyan',
    },
  ];

  constructor() {
    super();
    initialSettings.forEach((setting) => this.defineSetting(setting));
  }

  defineSetting<T>(item: SettingsItem<T>) {
    if (this.getSettingController(item.id)) {
      throw new Error(`Setting with id ${item.id} already exists.`);
    }

    const slice = createRecordSlice(item, { key: `kasif.${item.id}` });

    const controller = {
      id: item.id,
      instance: slice,
      update: (value: T) => {
        const oldValue = slice.get().value;
        slice.upsert({ ...item, value });
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
  }

  defineCategory(category: SettingCategory) {
    if (this.categories.find((c) => c.id === category.id)) {
      throw new Error(`Category with id ${category.id} already exists.`);
    }

    this.categories.push(category);
    this.dispatchEvent(new CustomEvent('define-category', { detail: category }));
  }

  getSettingController<T>(id: SettingsItem<T>['id']): SettingController<T> | undefined {
    const result = this.controllers.find((controller) => controller.id === id);

    return result as SettingController<T>;
  }
}
