import { createRecordSlice } from '@kasif-apps/cinq';
import { app } from '@kasif/config/app';
import { BaseManager } from '@kasif/managers/base';
import { View } from '@kasif/managers/view';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { RenderableNode } from '@kasif/util/node-renderer';

export interface Pane {
  id: string;
  render: RenderableNode;
  width?: number;
}

export interface PaneStore {
  panes: Pane[];
}

@tracker('paneManager')
export class PaneManager extends BaseManager {
  store = createRecordSlice<PaneStore>(
    {
      panes: [],
    },
    { key: 'pane-store' }
  );

  @trackable
  @authorized(['push_pane'])
  pushPane(pane: Pane) {
    this.store.upsert(() => ({
      panes: [pane],
    }));
    this.dispatchEvent(new CustomEvent('push-pane', { detail: pane }));
    this.app.notificationManager.log(`Pane (${pane.id}) pushed`, 'Pane Pushed');
  }

  @trackable
  @authorized(['remove_pane'])
  removePane(paneId: Pane['id']) {
    this.store.setKey('panes', []);

    this.dispatchEvent(new CustomEvent('remove-pane', { detail: paneId }));
    this.app.notificationManager.log(`Pane (${paneId}) removed`, 'Pane Removed');
  }

  @trackable
  @authorized(['remove_pane'])
  removeAllPanes() {
    this.store.setKey('panes', []);
    this.dispatchEvent(new CustomEvent('remove-all-panes'));
    this.app.notificationManager.log('All panes removed', 'Pane Removed');
  }

  @trackable
  getPane(paneId: Pane['id']) {
    return this.store.get().panes.find((pane) => pane.id === paneId);
  }

  @trackable
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

  @trackable
  @authorized(['replace_pane'])
  replacePane(paneId: Pane['id'], pane: Pane) {
    this.store.upsert((oldState) => ({
      panes: (oldState as PaneStore).panes.map((p) => (p.id === paneId ? pane : p)),
    }));

    this.dispatchEvent(new CustomEvent('replace-pane', { detail: pane }));
    this.app.notificationManager.log(
      `Pane (${paneId}) replaced with (${pane.id})`,
      'Pane Replaced'
    );
  }
}
