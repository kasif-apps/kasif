import { App } from '@kasif/config/app';
import { LocaleString } from '@kasif/config/i18n';
import { getInitialBottomItems, getInitialTopItems } from '@kasif/config/navbar';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { RenderableNode } from '@kasif/util/node-renderer';

import { RecordSlice, createRecordSlice } from '@kasif-apps/cinq';
import { t } from 'i18next';

export interface NavbarItem {
  id: string;
  icon: RenderableNode;
  label: LocaleString;
  onClick?(): void;
}

export interface NavbarStore {
  topItems: NavbarItem[];
  bottomItems: NavbarItem[];
}

@tracker('navbarManager')
export class NavbarManager extends BaseManager {
  store: RecordSlice<NavbarStore>;

  initialTopItemsCount: number;
  initialBottomItemsCount: number;

  constructor(app: App, parent?: App) {
    super(app, parent);

    const initialTopItems = getInitialTopItems(app);
    const initialBottomItems = getInitialBottomItems(app);

    this.store = createRecordSlice<NavbarStore>(
      { topItems: initialTopItems, bottomItems: initialBottomItems },
      { key: 'navbar-store' }
    );

    this.initialTopItemsCount = initialTopItems.length;
    this.initialBottomItemsCount = initialBottomItems.length;
  }

  @trackable
  @authorized(['push_navbar_item'])
  pushTopItem(item: NavbarItem) {
    const itemExists = this.store.get().topItems.some(i => i.id === item.id);

    if (itemExists) {
      this.app.notificationManager.error(
        `${t('notification.navbar-item-exists.description')} (${item.id})`,
        t('notification.navbar-item-exists.title')!
      );
      return;
    }

    this.store.upsert(oldState => ({
      topItems: [...(oldState as NavbarStore).topItems, item],
    }));

    this.dispatchEvent(new CustomEvent('push-top-item', { detail: item }));
  }

  @trackable
  @authorized(['remove_navbar_item'])
  removeTopItem(itemId: NavbarItem['id']) {
    this.store.upsert(oldState => ({
      topItems: (oldState as NavbarStore).topItems.filter(item => item.id !== itemId),
    }));

    this.dispatchEvent(new CustomEvent('remove-top-item', { detail: itemId }));
  }

  @trackable
  @authorized(['push_navbar_item'])
  pushBottomItem(item: NavbarItem) {
    const itemExists = this.store.get().bottomItems.some(i => i.id === item.id);

    if (itemExists) {
      this.app.notificationManager.error(
        `${t('notification.navbar-item-exists.description')} (${item.id})`,
        t('notification.navbar-item-exists.title')!
      );
      return;
    }

    this.store.upsert(oldState => ({
      bottomItems: [...(oldState as NavbarStore).bottomItems, item],
    }));

    this.dispatchEvent(new CustomEvent('push-bottom-item', { detail: item }));
  }

  @trackable
  @authorized(['remove_navbar_item'])
  removeBottomItem(itemId: NavbarItem['id']) {
    this.store.upsert(oldState => ({
      bottomItems: (oldState as NavbarStore).bottomItems.filter(item => item.id !== itemId),
    }));

    this.dispatchEvent(new CustomEvent('remove-bottom-item', { detail: itemId }));
  }
}
