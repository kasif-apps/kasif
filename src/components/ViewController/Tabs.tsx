import { useState } from 'react';
import { Group } from '@mantine/core';
import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  OnDragUpdateResponder,
} from 'react-beautiful-dnd';
import { TabItem } from './TabItem';

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function Tabs() {
  const [{ views: items, currentView }] = useSlice(app.viewManager.store);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const onDragEnd = (result: DropResult) => {
    setDraggedItemId(null);
    if (!result.destination) {
      return;
    }

    const newItems = reorder(items, result.source.index, result.destination.index);
    app.viewManager.store.upsert({ views: newItems });
  };

  const onDragUpdate = (update: Parameters<OnDragUpdateResponder>[0]) => {
    setDraggedItemId(update.draggableId);
  };

  return (
    <DragDropContext onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
      <Group
        sx={{
          height: '100%',
          gap: 6,
          flexWrap: 'nowrap',
        }}
      >
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided: DroppableProvided) => (
            <div
              ref={provided.innerRef}
              style={{
                display: 'flex',
              }}
              {...provided.droppableProps}
            >
              {items.map((view, index) => (
                <Draggable key={view.id} draggableId={view.id} index={index}>
                  {(draggableProvided: DraggableProvided) => (
                    <TabItem
                      provided={draggableProvided}
                      key={view.id}
                      active={view.id === currentView}
                      dragging={draggedItemId === view.id}
                      beforeActive={
                        items.findIndex((item) => item.id === currentView)! ===
                        items.findIndex((item) => item.id === view.id)! + 1
                      }
                      {...view}
                    />
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </Group>
    </DragDropContext>
  );
}
