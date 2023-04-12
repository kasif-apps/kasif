import { createRecordSlice } from '@kasif-apps/cinq';
import { WelcomePage } from '@kasif/pages/WelcomePage';
import { BaseManager } from '@kasif/managers/base';
import { RenderableNode } from '@kasif/util/node-renderer';
import { authorized, trackable, tracker } from '@kasif/util/decorators';

export interface View {
  id: string;
  title: string;
  icon: RenderableNode | null;
  render: RenderableNode;
}

export interface ViewStore {
  views: View[];
  currentView: View['id'] | null;
}

@tracker('viewManager')
export class ViewManager extends BaseManager {
  store = createRecordSlice<ViewStore>(
    {
      views: [],
      currentView: null,
    },
    { key: 'view-store' }
  );

  @trackable
  @authorized(['push_view'])
  pushView({ view }: { view: View }) {
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
    this.app.notificationManager.log(`View '${view.title}' (${view.id}) pushed`, 'View Pushed');
  }

  @trackable
  @authorized(['remove_view'])
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
    this.app.notificationManager.log(`View (${viewId}) removed`, 'View Removed');
  }

  @trackable
  @authorized(['set_view'])
  setCurrentView(viewId: ViewStore['currentView']) {
    if (this.store.get().currentView !== viewId) {
      this.store.setKey('currentView', viewId);

      this.dispatchEvent(new CustomEvent('set-view', { detail: viewId }));
      this.app.notificationManager.log(`View (${viewId ?? 'home'}) set`, 'View Set');
    }
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
