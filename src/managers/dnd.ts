import { DropResult, OnDragUpdateResponder } from 'react-beautiful-dnd';

import { app } from '@kasif/config/app';
import { BaseManager } from '@kasif/managers/base';
import { tracker } from '@kasif/util/decorators';
import { reorder } from '@kasif/util/misc';

import { createSlice } from '@kasif-apps/cinq';

@tracker('dndManager')
export class DndManager extends BaseManager {
  isDragging = createSlice(false, { key: 'is-dragging' });
  draggedItem = createSlice<string | null>(null, { key: 'dragged-item' });

  onDragEnd = (result: DropResult) => {
    app.dndManager.draggedItem.set(null);
    app.dndManager.isDragging.set(false);
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === 'tabs') {
      this.handleTabDragEnd(result);
    }

    this.dispatchEvent(new CustomEvent('drag-end', { detail: result }));
  };

  handleTabDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.droppableId.startsWith('busy-pane-id:')) {
      const id = result.destination.droppableId.split(':')[1];
      const pane = app.paneManager.createPaneFromView(result.draggableId);

      if (pane) {
        const { panes } = app.paneManager.store.get();
        const previousPane = panes.find(item => item.id === id);

        if (previousPane) {
          app.paneManager.replacePane(id, {
            ...pane,
            position: previousPane.position,
            size: previousPane.size,
          });
          app.viewManager.removeView(result.draggableId);
        }
      }
      return;
    }

    switch (result.destination.droppableId) {
      case 'tabs':
        {
          const newItems = reorder(
            app.viewManager.store.get().views,
            result.source.index,
            result.destination.index
          );
          app.viewManager.store.upsert({ views: newItems });
        }
        return;
      case 'free-right-pane':
        {
          const pane = app.paneManager.createPaneFromView(result.draggableId);

          if (pane) {
            app.paneManager.pushPane({ ...pane, position: 'right' });
            app.viewManager.removeView(result.draggableId);
          }
        }
        break;
      case 'free-bottom-pane':
        {
          const pane = app.paneManager.createPaneFromView(result.draggableId);

          if (pane) {
            app.paneManager.pushPane({ ...pane, position: 'bottom' });
            app.viewManager.removeView(result.draggableId);
          }
        }
        break;
      default:
        break;
    }
  }

  onDragUpdate = (update: Parameters<OnDragUpdateResponder>[0]) => {
    app.dndManager.draggedItem.set(update.draggableId);

    this.dispatchEvent(new CustomEvent('drag-update', { detail: update }));
  };

  onDragStart = () => {
    app.dndManager.isDragging.set(true);

    this.dispatchEvent(new CustomEvent('drag-start'));
  };
}
