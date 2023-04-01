import { createRecordSlice } from '@kasif-apps/cinq';
import { app } from '@kasif/config/app';
import { BaseManager } from '@kasif/managers/base';
import { View } from '@kasif/managers/view';
import { RenderableNode } from '@kasif/util/node-renderer';

export interface Pane {
  id: string;
  render: React.FC | RenderableNode;
}

export interface PaneStore {
  panes: Pane[];
}

export class PaneManager extends BaseManager {
  store = createRecordSlice<PaneStore>(
    {
      panes: [],
    },
    { key: 'pane-store' }
  );

  pushPane(pane: Pane) {
    this.store.upsert(() => ({
      panes: [pane],
    }));
  }

  removePane(paneId: Pane['id']) {
    this.store.setKey('panes', []);

    this.dispatchEvent(new CustomEvent('remove-pane', { detail: paneId }));
  }

  removeAllPanes() {
    this.store.setKey('panes', []);
    this.dispatchEvent(new CustomEvent('remove-all-panes'));
  }

  getPane(paneId: Pane['id']) {
    return this.store.get().panes.find((pane) => pane.id === paneId);
  }

  createPaneFromView(viewId: View['id']): Pane | undefined {
    const instance = app.viewManager.store.get();
    const view = instance.views.find((v) => v.id === viewId);
    if (!view) {
      return;
    }

    const component = app.viewManager.getViewComponent(view.id);

    return {
      id: viewId,
      render: component,
    };
  }

  replacePane(paneId: Pane['id'], pane: Pane) {
    this.store.upsert((oldState) => ({
      panes: (oldState as PaneStore).panes.map((p) => (p.id === paneId ? pane : p)),
    }));

    this.dispatchEvent(new CustomEvent('replace-pane', { detail: pane }));
  }
}
