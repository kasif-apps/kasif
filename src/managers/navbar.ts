import { createRecordSlice } from '@kasif-apps/cinq';
import { initialBottomItems, initialTopItems } from '@kasif/config/navbar';
import React from 'react';

export interface NavbarItem {
  id: string;
  icon: React.FC;
  label: string;
  onClick?(): void;
}

export interface NavbarStore {
  topItems: NavbarItem[];
  bottomItems: NavbarItem[];
}

export class NavbarManager extends EventTarget {
  store = createRecordSlice<NavbarStore>(
    { topItems: initialTopItems, bottomItems: initialBottomItems },
    { key: 'navbar-store' }
  );

  initialTopItemsCount = initialTopItems.length;
  initialBottomItemsCount = initialBottomItems.length;

  pushTopItem(item: NavbarItem) {
    const itemExists = this.store.get().topItems.some((i) => i.id === item.id);

    if (itemExists) {
      return;
    }

    this.store.upsert((oldState) => ({
      topItems: [...(oldState as NavbarStore).topItems, item],
    }));

    this.dispatchEvent(new CustomEvent('push-top-item', { detail: item }));
  }

  removeTopItem(itemId: NavbarItem['id']) {
    this.store.upsert((oldState) => ({
      topItems: (oldState as NavbarStore).topItems.filter((item) => item.id !== itemId),
    }));

    this.dispatchEvent(new CustomEvent('remove-top-item', { detail: itemId }));
  }

  pushBottomItem(item: NavbarItem) {
    const itemExists = this.store.get().bottomItems.some((i) => i.id === item.id);

    if (itemExists) {
      return;
    }

    this.store.upsert((oldState) => ({
      bottomItems: [...(oldState as NavbarStore).bottomItems, item],
    }));

    this.dispatchEvent(new CustomEvent('push-bottom-item', { detail: item }));
  }

  removeBottomItem(itemId: NavbarItem['id']) {
    this.store.upsert((oldState) => ({
      bottomItems: (oldState as NavbarStore).bottomItems.filter((item) => item.id !== itemId),
    }));

    this.dispatchEvent(new CustomEvent('remove-bottom-item', { detail: itemId }));
  }
}
