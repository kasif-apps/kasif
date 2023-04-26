import { LocaleString } from '@kasif/config/i18n';
import { initialBottomItems, initialTopItems } from '@kasif/config/navbar';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { RenderableNode } from '@kasif/util/node-renderer';

import { createRecordSlice } from '@kasif-apps/cinq';

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
  store = createRecordSlice<NavbarStore>(
    { topItems: initialTopItems, bottomItems: initialBottomItems },
    { key: 'navbar-store' }
  );

  initialTopItemsCount = initialTopItems.length;
  initialBottomItemsCount = initialBottomItems.length;

  @trackable
  @authorized(['push_navbar_item'])
  pushTopItem(item: NavbarItem) {
    const itemExists = this.store.get().topItems.some(i => i.id === item.id);

    if (itemExists) {
      this.app.notificationManager.error(
        `Top navbar item (${item.id}) exists`,
        'Navbar Item Cannot Be Pushed'
      );
      return;
    }

    this.store.upsert(oldState => ({
      topItems: [...(oldState as NavbarStore).topItems, item],
    }));

    this.dispatchEvent(new CustomEvent('push-top-item', { detail: item }));
    this.app.notificationManager.log(`Top navbar item (${item.id}) pushed`, 'Navbar Item Pushed');
  }

  @trackable
  @authorized(['remove_navbar_item'])
  removeTopItem(itemId: NavbarItem['id']) {
    this.store.upsert(oldState => ({
      topItems: (oldState as NavbarStore).topItems.filter(item => item.id !== itemId),
    }));

    this.dispatchEvent(new CustomEvent('remove-top-item', { detail: itemId }));
    this.app.notificationManager.log(`Top navbar item (${itemId}) removed`, 'Navbar Item Removed');
  }

  @trackable
  @authorized(['push_navbar_item'])
  pushBottomItem(item: NavbarItem) {
    const itemExists = this.store.get().bottomItems.some(i => i.id === item.id);

    if (itemExists) {
      return;
    }

    this.store.upsert(oldState => ({
      bottomItems: [...(oldState as NavbarStore).bottomItems, item],
    }));

    this.dispatchEvent(new CustomEvent('push-bottom-item', { detail: item }));
    this.app.notificationManager.log(
      `Bottom navbar item (${item.id}) pushed`,
      'Navbar Item Pushed'
    );
  }

  @trackable
  @authorized(['remove_navbar_item'])
  removeBottomItem(itemId: NavbarItem['id']) {
    this.store.upsert(oldState => ({
      bottomItems: (oldState as NavbarStore).bottomItems.filter(item => item.id !== itemId),
    }));

    this.dispatchEvent(new CustomEvent('remove-bottom-item', { detail: itemId }));
    this.app.notificationManager.log(
      `Bttom navbar item (${itemId}) removed`,
      'Navbar Item Removed'
    );
  }
}
