import { createVectorSlice } from '@kasif-apps/cinq';
import { app } from '@kasif/config/app';
import { initialToolbarItems, ToolbarItem } from '@kasif/config/toolbar';
import { BaseManager } from '@kasif/managers/base';

export class FolderContentManager extends BaseManager {
  selection = createVectorSlice<string[]>([], { key: 'folder-content-selection' });
  cut = createVectorSlice<string[]>([], { key: 'folder-content-cut' });
  clipboard = createVectorSlice<string[]>([], { key: 'folder-content-clipboard' });

  toolbarItems = createVectorSlice<ToolbarItem[]>(initialToolbarItems, {
    key: 'folder-content-toolbar-items',
  });

  select(id: string) {
    this.selection.push(id);

    this.dispatchEvent(new CustomEvent('select', { detail: [id] }));
  }

  deselect(id: string) {
    this.selection.splice(this.selection.get().indexOf(id), 1);

    this.dispatchEvent(new CustomEvent('deselect', { detail: [id] }));
  }

  set(ids: string[]) {
    this.selection.set(ids);

    this.dispatchEvent(new CustomEvent('select', { detail: ids }));
  }

  selectMultiple(ids: string[]) {
    this.selection.set([...this.selection.get(), ...ids]);

    this.dispatchEvent(new CustomEvent('select', { detail: ids }));
  }

  selectAll(ids: string[]) {
    this.selection.set(ids);

    this.dispatchEvent(new CustomEvent('select', { detail: ids }));
  }

  deselectAll() {
    this.selection.set([]);

    this.dispatchEvent(new CustomEvent('deselect', { detail: this.selection.get() }));
  }

  cutSelection() {
    const items = this.selection.get();
    this.cut.set(items);
    this.clipboard.set([...items, ...this.clipboard.get()]);
    this.deselectAll();

    this.dispatchEvent(new CustomEvent('cut', { detail: items }));
  }

  copySelection() {
    const items = this.selection.get();
    this.clipboard.set([...items, ...this.clipboard.get()]);

    this.dispatchEvent(new CustomEvent('copy', { detail: items }));
  }

  paste() {
    this.clipboard.set([]);
    this.cut.set([]);

    this.dispatchEvent(new CustomEvent('paste', { detail: this.clipboard.get() }));
  }

  defineToolbarItem(item: Omit<ToolbarItem, 'predefined'>) {
    const items = this.toolbarItems.get();
    if (items.some((i) => i.id === item.id)) {
      app.notificationManager.error('Toolbar item with this id already exists');
      return;
    }

    this.toolbarItems.push({ ...item, predefined: false });

    this.dispatchEvent(new CustomEvent('define-toolbar-item', { detail: item }));
  }
}
