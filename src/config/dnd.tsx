import { DragDropContext, DropResult, OnDragUpdateResponder } from 'react-beautiful-dnd';
import { draggedItem } from '@kasif/components/ViewController/Tabs';
import { useSlice } from '@kasif/util/cinq-react';
import { createSlice } from '@kasif-apps/cinq';
import { app } from './app';

export interface DndProviderProps {
  children: React.ReactNode;
}

export const isDraggingStore = createSlice(false, { key: 'is-dragging' });

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function DndProvider(props: DndProviderProps) {
  const [{ views }] = useSlice(app.viewManager.store);

  const onDragEnd = (result: DropResult) => {
    draggedItem.set(null);
    isDraggingStore.set(false);
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === 'tabs') {
      if (result.destination.droppableId.startsWith('busy-pane-id:')) {
        const id = result.destination.droppableId.split(':')[1];
        const pane = app.paneManager.createPaneFromView(result.draggableId);

        if (pane) {
          app.paneManager.replacePane(id, pane);
          app.viewManager.removeView(result.draggableId);
        }
        return;
      }

      switch (result.destination.droppableId) {
        case 'tabs':
          {
            const newItems = reorder(views, result.source.index, result.destination.index);
            app.viewManager.store.upsert({ views: newItems });
          }
          return;
        case 'free-pane':
          {
            const pane = app.paneManager.createPaneFromView(result.draggableId);

            if (pane) {
              app.paneManager.pushPane(pane);
              app.viewManager.removeView(result.draggableId);
            }
          }
          break;
        default:
          break;
      }
    }
  };

  const onDragUpdate = (update: Parameters<OnDragUpdateResponder>[0]) => {
    draggedItem.set(update.draggableId);
  };

  const onDragStart = () => {
    isDraggingStore.set(true);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
      {props.children}
    </DragDropContext>
  );
}
