import React from 'react';
import { createRecordSlice } from '@kasif-apps/cinq';
import { WelcomePage } from '@kasif/pages/WelcomePage';
import { BaseManager } from '@kasif/managers/base';

export interface View {
  id: string;
  title: string;
  icon: JSX.Element;
  render: React.FC;
}

export interface ViewStore {
  views: View[];
  currentView: View['id'] | null;
}

export class ViewManager extends BaseManager {
  store = createRecordSlice<ViewStore>(
    {
      views: [],
      currentView: null,
    },
    { key: 'view-store' }
  );

  // constructor() {
  //   super();

  // const transactor = new StorageTransactor({
  //   key: 'view-store',
  //   slice: this.store,
  //   type: 'localStorage',
  // });

  // transactor.init();
  // }

  pushView(view: View) {
    const viewExists = this.store.get().views.some((v) => v.id === view.id);

    if (viewExists) {
      this.store.setKey('currentView', view.id);
      this.dispatchEvent(new CustomEvent('set-view', { detail: view.id }));
      return;
    }

    this.store.upsert((oldState) => ({
      views: [...(oldState as ViewStore).views, view],
      currentView: view.id,
    }));

    this.dispatchEvent(new CustomEvent('push-view', { detail: view }));
    this.dispatchEvent(new CustomEvent('set-view', { detail: view.id }));
  }

  removeView(viewId: View['id']) {
    const value = this.store.get();
    const isCurrentView = value.currentView === viewId;
    let nextView: ViewStore['currentView'] = value.currentView;

    if (isCurrentView) {
      const viewIndex = value.views.findIndex((view) => view.id === viewId);

      if (viewIndex === 0) {
        nextView = value.views[1]?.id ?? null;
      } else {
        nextView = value.views[viewIndex - 1]?.id ?? null;
      }
    }

    this.store.upsert((oldState) => ({
      views: (oldState as ViewStore).views.filter((view) => view.id !== viewId),
      currentView: nextView,
    }));

    this.dispatchEvent(new CustomEvent('remove-view', { detail: viewId }));

    if (isCurrentView) {
      this.dispatchEvent(new CustomEvent('set-view', { detail: nextView }));
    }
  }

  setCurrentView(viewId: ViewStore['currentView']) {
    this.store.setKey('currentView', viewId);

    this.dispatchEvent(new CustomEvent('set-view', { detail: viewId }));
  }

  getViewComponent(id: ViewStore['currentView']): View['render'] {
    const state = this.store.get();
    const currentView = state.views.find((view) => view.id === id);

    if (currentView) {
      return currentView.render;
    }

    return WelcomePage;
  }
}
