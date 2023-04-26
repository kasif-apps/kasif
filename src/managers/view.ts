import { TransitionController } from '@kasif/components/Transition/TransitionWrapper';
import { LocaleString } from '@kasif/config/i18n';
import { getPrebuiltViews } from '@kasif/config/view';
import { BaseManager } from '@kasif/managers/base';
import { WelcomePage } from '@kasif/pages/WelcomePage';
import { authorized, trackable, tracker } from '@kasif/util/decorators';
import { RenderableNode } from '@kasif/util/node-renderer';

import { createRecordSlice } from '@kasif-apps/cinq';

export interface View {
  id: string;
  title: LocaleString;
  icon: RenderableNode | null;
  render: RenderableNode;
}

export interface ViewStore {
  views: View[];
  currentView: View['id'] | null;
}

export type ViewTransitionControllerStore = Record<
  string,
  { view?: TransitionController; handle?: TransitionController }
>;

@tracker('viewManager')
export class ViewManager extends BaseManager {
  store = createRecordSlice<ViewStore>(
    {
      views: [],
      currentView: null,
    },
    { key: 'view-store' }
  );

  controllers = createRecordSlice<ViewTransitionControllerStore>(
    {},
    { key: 'view-transition-controller-store' }
  );

  prebuiltViews = getPrebuiltViews(this.app);

  @trackable
  @authorized(['push_view'])
  pushView({ view }: { view: View }) {
    const viewExists = this.store.get().views.some(v => v.id === view.id);

    if (viewExists) {
      this.store.setKey('currentView', view.id);
      this.dispatchEvent(new CustomEvent('set-view', { detail: view.id }));
      return;
    }

    this.store.upsert(oldState => ({
      views: [...(oldState as ViewStore).views, view],
      currentView: view.id,
    }));

    this.dispatchEvent(new CustomEvent('push-view', { detail: view }));
    this.dispatchEvent(new CustomEvent('set-view', { detail: view.id }));
  }

  @trackable
  @authorized(['remove_view'])
  async removeView(viewId: View['id']) {
    const controllers = this.controllers.get();
    const controller = controllers[viewId];

    if (controller) {
      const promises = [];
      if (controller.handle) {
        promises.push(controller.handle.unMount());
        this.controllers.upsert({ [viewId]: { handle: undefined } });
      }

      if (controller.view) {
        promises.push(controller.view.unMount());
        this.controllers.upsert({ [viewId]: { view: undefined } });
      }

      await Promise.all(promises);
    }

    const value = this.store.get();
    const isCurrentView = value.currentView === viewId;
    let nextView: ViewStore['currentView'] = value.currentView;

    if (isCurrentView) {
      const viewIndex = value.views.findIndex(view => view.id === viewId);

      if (viewIndex === 0) {
        nextView = value.views[1]?.id ?? null;
      } else {
        nextView = value.views[viewIndex - 1]?.id ?? null;
      }
    }

    this.store.upsert(oldState => ({
      views: (oldState as ViewStore).views.filter(view => view.id !== viewId),
      currentView: nextView,
    }));

    this.dispatchEvent(new CustomEvent('remove-view', { detail: viewId }));

    if (isCurrentView) {
      this.dispatchEvent(new CustomEvent('set-view', { detail: nextView }));
    }
  }

  @trackable
  @authorized(['set_view'])
  setCurrentView(viewId: ViewStore['currentView']) {
    if (this.store.get().currentView !== viewId) {
      this.store.setKey('currentView', viewId);

      this.dispatchEvent(new CustomEvent('set-view', { detail: viewId }));
    }
  }

  getViewComponent(id: ViewStore['currentView']): View['render'] {
    const state = this.store.get();
    const currentView = state.views.find(view => view.id === id);

    if (currentView) {
      return currentView.render;
    }

    return WelcomePage;
  }
}
