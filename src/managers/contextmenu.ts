import { app } from '@kasif/config/app';
import { initAppContextMenu } from '@kasif/config/contextmenu';
import { BaseManager } from '@kasif/managers/base';
import { useSlice } from '@kasif/util/cinq-react';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { RenderableNode } from '@kasif/util/node-renderer';

import { RecordSlice, createRecordSlice, createVectorSlice } from '@kasif-apps/cinq';

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
  items: ContextMenuItemInstance[];
}

export type ContextMenuItemInstance = ContextMenuItem | ContextMenuParent;

export interface ContextMenuItem {
  id: string;
  title: string;
  onTrigger: () => Promise<unknown>;
  category: string;
  shortCut?: string;
  icon?: RenderableNode;
  registerCommand?: boolean;
  condition?: () => Promise<boolean>;
}

export interface ContextMenuParent {
  id: string;
  title: string;
  category: string;
  icon?: RenderableNode;
  condition?: () => Promise<boolean>;
  children: ContextMenuItemInstance[];
}

export function isContextMenuParent(
  instance: ContextMenuItemInstance
): instance is ContextMenuParent {
  return (instance as ContextMenuParent).children !== undefined;
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

  categories = createVectorSlice<ContextMenuCategory[]>([], {
    key: 'context-menu-categories',
  });

  fields = createVectorSlice<ContextMenuField[]>([], {
    key: 'context-menu-fields',
  });

  currentItems = createVectorSlice<ContextMenuItemInstance[]>([], {
    key: 'context-menu-current-items',
  });

  currentFields = createVectorSlice<Array<string>>([], {
    key: 'context-menu-current-fields',
  });

  currentPath = createVectorSlice<Array<HTMLElement>>([], {
    key: 'context-menu-current-path',
  });

  @trackable
  @authorized(['reinit_command_manager'])
  init() {
    document.addEventListener('contextmenu', e => this.#handleContextMenuEvent(e));
    initAppContextMenu(this.app);
  }

  async #handleContextMenuEvent(event: MouseEvent) {
    event.preventDefault();

    const path = event.composedPath().filter(item => {
      if (!item) return false;

      if (item instanceof HTMLElement) {
        return true;
      }

      return false;
    }) as HTMLElement[];

    const targets = this.#getTargets(path);

    const items: ContextMenuItemInstance[] = [];
    const fields = this.fields.get();
    const targetFields: string[] = [];

    for await (const field of fields) {
      if (targets.includes(field.id)) {
        targetFields.push(field.id);
        let { items: subItems } = field;

        for await (const item of subItems) {
          if (item.condition && (await item.condition()) === false) {
            subItems = subItems.filter(i => i.id !== item.id);
          }
        }

        items.push(...subItems);
      }
    }

    this.currentItems.set(items);
    this.currentFields.set(targetFields);
    this.currentPath.set(path);

    if (this.currentItems.get().length > 0) {
      this.openMenu({ x: event.clientX, y: event.clientY });
    }
  }

  #getTargets(path: HTMLElement[]) {
    const ids: string[] = [];
    path.forEach(element => {
      const id = element.getAttribute('data-contextmenu-field');

      if (id) ids.push(id);
    });

    return ids;
  }

  @trackable
  @authorized(['kill_contextmenu_manager'])
  kill() {
    this.fields.set([]);
    this.categories.set([]);
    this.app.notificationManager.warn(
      `Context menu manager killed by ${this.app.name} (${this.app.id})`,
      'Context Menu Manager Killed'
    );
  }

  @trackable
  @authorized(['open_contextmenu'])
  openMenu(position: ContextMenuState['position']) {
    this.store.upsert({ open: false, position: { x: 0, y: 0 } });
    setTimeout(() => {
      this.store.upsert({ open: true, position });
      this.dispatchEvent(new CustomEvent('open-menu', { detail: position }));
    }, 10);
  }

  @trackable
  @authorized(['close_contextmenu'])
  closeMenu() {
    this.store.setKey('open', false);
    this.currentItems.set([]);
    this.currentFields.set([]);
    this.currentPath.set([]);
    this.dispatchEvent(new CustomEvent('close-menu'));
  }

  @trackable
  @authorized(['define_contextmenu_field'])
  defineField(id: string) {
    this.fields.push({ id, items: [] });
  }

  @trackable
  @authorized(['define_contextmenu_category'])
  defineCategory(category: ContextMenuCategory) {
    this.categories.push(category);
  }

  @trackable
  @authorized(['define_contextmenu_item'])
  defineItem(fieldId: string, item: ContextMenuItemInstance) {
    const fields = this.fields.get();
    const categories = this.categories.get();
    const targetFieldIndex = fields.findIndex(field => field.id === fieldId);
    const targetCategoryIndex = categories.findIndex(category => category.id === item.category);

    const defineCommandFromItem = (instance: ContextMenuItemInstance) => {
      const isParent = isContextMenuParent(instance);

      if (!isParent) {
        if (instance.shortCut && instance.registerCommand) {
          this.app.commandManager.defineCommand(instance);
        }
      } else {
        for (const child of instance.children) {
          defineCommandFromItem(child);
        }
      }
    };

    if (targetFieldIndex >= 0) {
      if (targetCategoryIndex >= 0) {
        defineCommandFromItem(item);

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

export function useContextMenuItems(): Map<ContextMenuCategory, ContextMenuItemInstance[]> {
  const items: Map<ContextMenuCategory, ContextMenuItemInstance[]> = new Map();

  const [currentItems] = useSlice(app.contextMenuManager.currentItems);
  const [categories] = useSlice(app.contextMenuManager.categories);

  currentItems.forEach(item => {
    const targetCategory = categories.find(category => category.id === item.category);

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
