import { app } from '@kasif/config/app';
import { BaseManager } from '@kasif/managers/base';
import { View } from '@kasif/managers/view';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { RenderableNode } from '@kasif/util/node-renderer';

import { createRecordSlice } from '@kasif-apps/cinq';

export interface Pane {
  id: string;
  render: RenderableNode;
  size: number | string;
  position: 'right' | 'left' | 'top' | 'bottom';
}

export interface PaneStore {
  panes: Pane[];
}

export interface PaneSizes {
  horizontal: Array<number | string>;
  vertical: Array<number | string>;
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
@tracker('paneManager')
export class PaneManager extends BaseManager {
  store = createRecordSlice<PaneStore>(
    {
      panes: [],
    },
    { key: 'pane-store' }
  );

  paneSizes = createRecordSlice<PaneSizes>(
    {
      horizontal: [],
      vertical: [],
    },
    { key: 'pane-sizes' }
  );

  @trackable
  @authorized(['push_pane'])
  pushPane(pane: Optional<Optional<Pane, 'position'>, 'size'>) {
    this.store.upsert(oldState => ({
      panes: [
        ...(oldState.panes || []),
        {
          ...pane,
          position: pane.position || 'right',
          size: `calc(100% / ${oldState.panes?.length || 1})`,
        },
      ],
    }));
    this.dispatchEvent(new CustomEvent('push-pane', { detail: pane }));
  }

  @trackable
  @authorized(['remove_pane'])
  removePane(paneId: Pane['id']) {
    this.store.setKey(
      'panes',
      (this.store.get().panes || []).filter(item => item.id !== paneId)
    );

    this.dispatchEvent(new CustomEvent('remove-pane', { detail: paneId }));
  }

  @trackable
  @authorized(['remove_pane'])
  removeAllPanes() {
    this.store.setKey('panes', []);
    this.dispatchEvent(new CustomEvent('remove-all-panes'));
  }

  @trackable
  getPane(paneId: Pane['id']) {
    return this.store.get().panes.find(pane => pane.id === paneId);
  }

  @trackable
  createPaneFromView(viewId: View['id']): Optional<Optional<Pane, 'position'>, 'size'> | undefined {
    const instance = app.viewManager.store.get();
    const view = instance.views.find(v => v.id === viewId);
    if (!view) {
      return;
    }

    const component = app.viewManager.getViewComponent(view.id);

    return {
      id: viewId,
      render: component,
    };
  }

  @trackable
  @authorized(['replace_pane'])
  replacePane(paneId: Pane['id'], pane: Pane) {
    this.store.upsert(oldState => ({
      panes: (oldState as PaneStore).panes.map(p => (p.id === paneId ? pane : p)),
    }));

    this.dispatchEvent(new CustomEvent('replace-pane', { detail: pane }));
  }
}
