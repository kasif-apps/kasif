import { createRecordSlice } from '@kasif-apps/cinq';
import { BaseManager } from '@kasif/managers/base';

export interface Pane {
  id: string;
  Component: React.FC;
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
    // const paneExists = this.store.get().panes.some((p) => p.id === pane.id);

    // if (paneExists) {
    //   this.store.setKey('currentPane', pane.id);
    //   return;
    // }

    // this.store.upsert((oldState) => ({
    //   panes: [...(oldState as PaneStore).panes, pane],
    //   currentPane: pane.id,
    // }));

    // this.dispatchEvent(new CustomEvent('push-pane', { detail: pane }));
    // this.dispatchEvent(new CustomEvent('set-pane', { detail: pane.id }));
    this.store.upsert(() => ({
      panes: [pane],
    }));
  }

  removePane(paneId: Pane['id']) {
    // this.store.upsert((oldState) => ({
    //   panes: (oldState as PaneStore).panes.filter((pane) => pane.id !== paneId),
    // }));
    this.store.setKey('panes', []);

    this.dispatchEvent(new CustomEvent('remove-pane', { detail: paneId }));
  }

  getPane(paneId: Pane['id']) {
    return this.store.get().panes.find((pane) => pane.id === paneId);
  }
}
