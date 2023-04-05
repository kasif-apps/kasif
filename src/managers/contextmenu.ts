import { createRecordSlice, createVectorSlice, RecordSlice, VectorSlice } from '@kasif-apps/cinq';
import { app } from '@kasif/config/app';
import { BaseManager } from '@kasif/managers/base';
import { useSlice } from '@kasif/util/cinq-react';
import { trackable, tracker } from '@kasif/util/misc';
import { RenderableNode } from '@kasif/util/node-renderer';

export interface ContextMenuState {
  position: {
    x: number;
    y: number;
  };
  open: boolean;
}

export interface ContextMenuCategory {
  id: string;
  title: string;
  order: number;
}

export interface ContextMenuField {
  id: string;
  items: ContextMenuItem[];
}

export interface ContextMenuItem {
  id: string;
  title: string;
  onTrigger: () => Promise<unknown>;
  category: string;
  shortCut?: string;
  icon?: React.FC | RenderableNode;
}

@tracker('contextMenuManager')
export class ContextMenuManager extends BaseManager {
  store: RecordSlice<ContextMenuState> = createRecordSlice<ContextMenuState>(
    {
      position: {
        x: 0,
        y: 0,
      },
      open: false,
    },
    { key: 'context-menu-state' }
  );

  categories: VectorSlice<ContextMenuCategory[]> = createVectorSlice<ContextMenuCategory[]>([], {
    key: 'context-menu-categories',
  });

  fields: VectorSlice<ContextMenuField[]> = createVectorSlice<ContextMenuField[]>([], {
    key: 'context-menu-fields',
  });

  currentItems: VectorSlice<ContextMenuItem[]> = createVectorSlice<ContextMenuItem[]>([], {
    key: 'context-menu-current-items',
  });

  init() {
    document.addEventListener('contextmenu', (e) => this.#handleContextMenuEvent(e));
  }

  #handleContextMenuEvent(event: MouseEvent) {
    event.preventDefault();

    const targets = this.#getTargets(
      event.composedPath().filter((item) => {
        if (!item) return false;

        if (item instanceof HTMLElement) {
          return true;
        }

        return false;
      }) as HTMLElement[]
    );

    const items: ContextMenuItem[] = [];
    const fields = this.fields.get();

    fields.forEach((field) => {
      if (targets.includes(field.id)) {
        items.push(...field.items);
      }
    });

    this.currentItems.set(items);

    if (this.currentItems.get().length > 0) {
      this.openMenu({ x: event.clientX, y: event.clientY });
    }
  }

  #getTargets(path: HTMLElement[]) {
    const ids: string[] = [];
    path.forEach((element) => {
      const id = element.getAttribute('data-contextmenu-field');

      if (id) ids.push(id);
    });

    return ids;
  }

  @trackable
  openMenu(position: ContextMenuState['position']) {
    this.store.upsert({ open: true, position });
    this.dispatchEvent(new CustomEvent('open-menu', { detail: position }));
  }

  @trackable
  closeMenu() {
    this.store.setKey('open', false);
    this.dispatchEvent(new CustomEvent('close-menu'));
  }

  @trackable
  defineField(id: string) {
    this.fields.push({ id, items: [] });
  }

  @trackable
  defineCategory(category: ContextMenuCategory) {
    this.categories.push(category);
  }

  @trackable
  defineItem(fieldId: string, item: ContextMenuItem) {
    const fields = this.fields.get();
    const categories = this.categories.get();
    const targetFieldIndex = fields.findIndex((field) => field.id === fieldId);
    const targetCategoryIndex = categories.findIndex((category) => category.id === item.category);

    if (targetFieldIndex >= 0) {
      if (targetCategoryIndex >= 0) {
        if (item.shortCut) {
          this.app.commandManager.defineCommand(item);
        }

        this.fields.setAt(targetFieldIndex, {
          ...fields[targetFieldIndex],
          items: [...fields[targetFieldIndex].items, item],
        });
      } else {
        this.app.notificationManager.error(
          `Could not find context menu category with id (${item.category})`,
          'Error Defining Context Menu Item'
        );
      }
    } else {
      this.app.notificationManager.error(
        `Could not find context menu field with id (${fieldId})`,
        'Error Defining Context Menu Item'
      );
    }
  }
}

export function useContextMenuItems(): Map<ContextMenuCategory, ContextMenuItem[]> {
  const items: Map<ContextMenuCategory, ContextMenuItem[]> = new Map();

  const [currentItems] = useSlice(app.contextMenuManager.currentItems);
  const [categories] = useSlice(app.contextMenuManager.categories);

  currentItems.forEach((item) => {
    const targetCategory = categories.find((category) => category.id === item.category);

    if (targetCategory) {
      const hasKey = items.has(targetCategory);
      const targetItems = items.get(targetCategory);
      if (hasKey && targetItems) {
        items.set(targetCategory, [...targetItems, item]);
      } else {
        items.set(targetCategory, [item]);
      }
    }
  });

  return items;
}
