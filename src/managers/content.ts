import { createVectorSlice } from '@kasif-apps/cinq';
import { BaseManager } from '@kasif/managers/base';

export class FolderContentManager extends BaseManager {
  selection = createVectorSlice<string[]>([], { key: 'folder-content-selection' });
  cut = createVectorSlice<string[]>([], { key: 'folder-content-cut' });
  clipboard = createVectorSlice<string[]>([], { key: 'folder-content-clipboard' });

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
}
