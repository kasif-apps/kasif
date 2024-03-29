import { App } from '@kasif/config/app';
import { LocaleString } from '@kasif/config/i18n';
import { getInitialCategories, getInitialSettings } from '@kasif/config/settings';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { FSTransactor, environment } from '@kasif/util/environment';
import { RenderableNode } from '@kasif/util/node-renderer';

import { RecordSlice, StorageTransactor, createRecordSlice } from '@kasif-apps/cinq';
import { t } from 'i18next';

export interface SettingCategory {
  id: string;
  title: LocaleString;
  description: LocaleString;
  color?: string;
}

export interface SettingsItem<T> {
  id: string;
  category: SettingCategory['id'];
  title: LocaleString;
  description: LocaleString;
  value: T;
  render: RenderableNode;
}

export interface SettingController<T> {
  id: SettingsItem<T>['id'];
  raw: SettingsItem<T>;
  instance: RecordSlice<SettingsItem<T>>;
  category: SettingsItem<T>['category'];
  update: (value: T) => void;
}

export interface SettingsStore {
  items: SettingsItem<unknown>[];
}

@tracker('settingsManager')
export class SettingsManager extends BaseManager {
  controllers: SettingController<any>[] = [];
  categories: SettingCategory[] = [];
  store = createRecordSlice<Record<string, unknown>>({}, { key: 'settings' });

  constructor(app: App, parent?: App) {
    super(app, parent);

    if (!parent) {
      getInitialCategories(app).forEach(category => this.defineCategory(category));
      getInitialSettings(app).forEach(setting => this.defineSetting(setting));
    }

    this.store.subscribe(() => {
      const settings = this.store.get();

      for (const [key, setting] of Object.entries(settings)) {
        const controller = this.getSettingController(key);

        if (controller) {
          controller.instance.set({ ...controller.raw, value: setting });
        }
      }
    });

    if (environment.currentEnvironment === 'desktop') {
      environment.path.appLocalDataDir().then(async dir => {
        const path = await environment.path.join(dir, 'settings.json');

        const transactor = new FSTransactor({
          key: 'settings',
          slice: this.store,
          path,
        });

        transactor.init();
        this.dispatchEvent(new CustomEvent('ready', { detail: 'settingsManager' }));
      });
    } else {
      const transactor = new StorageTransactor({
        key: 'settings',
        slice: this.store,
      });

      transactor.init();
      this.dispatchEvent(new CustomEvent('ready', { detail: 'settingsManager' }));
    }
  }

  @trackable
  @authorized(['define_setting'])
  defineSetting<T>(item: SettingsItem<T>) {
    if (this.getSettingController(item.id)) {
      this.app.notificationManager.error(
        `${t('notification.settings.cannot-define-setting.description')} ('${item.id}')`,
        t('notification.settings.cannot-define-setting.title')!
      );
      return;
    }

    const slice = createRecordSlice(item, { key: item.id });
    this.store.upsert({ [slice.key]: slice.get().value });

    const controller: SettingController<T> = {
      id: item.id,
      raw: item,
      instance: slice,
      update: (value: T) => {
        const oldValue = slice.get().value;
        slice.upsert({ ...item, value });
        this.store.upsert({ [slice.key]: slice.get().value });

        this.dispatchEvent(
          new CustomEvent('update-setting', {
            detail: { id: item.id, oldValue, newValue: value, controller },
          })
        );
      },
      category: item.category,
    };

    this.controllers.push(controller);
    this.dispatchEvent(new CustomEvent('define-setting', { detail: controller }));
  }

  @trackable
  @authorized(['define_setting_category'])
  defineCategory(category: SettingCategory) {
    if (this.categories.find(c => c.id === category.id)) {
      this.app.notificationManager.error(
        `${t('notification.settings.cannot-define-category.description')} ${category.id}`,
        t('notification.settings.cannot-define-category.title')!
      );
      return;
    }

    this.categories.push(category);
    this.dispatchEvent(new CustomEvent('define-category', { detail: category }));
  }

  @trackable
  @authorized(['read_setting'])
  getSettingController<T>(id: SettingsItem<T>['id']): SettingController<T> | undefined {
    const result = this.controllers.find(controller => controller.id === id);

    return result as SettingController<T>;
  }

  @trackable
  @authorized(['read_setting'])
  getSetting<T>(id: SettingsItem<T>['id']): T | undefined {
    const setting = this.app.settingsManager.getSettingController<T>(id);

    if (setting) {
      return setting.instance.get().value;
    }
  }
}
