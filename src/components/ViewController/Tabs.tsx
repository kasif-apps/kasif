import { Group } from '@mantine/core';
import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import { Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { getOS } from '@kasif/util/misc';
import { TabItem } from './TabItem';

export function Tabs() {
  const [{ views: items, currentView }] = useSlice(app.viewManager.store);
  const [draggedItemId] = useSlice(app.dndManager.draggedItem);
  const os = getOS();

  return (
    <Group
      sx={{
        position: 'relative',
        height: '100%',
        gap: 6,
        flexWrap: 'nowrap',
      }}
      data-tauri-drag-region={os === 'macos'}
    >
      <Droppable droppableId="tabs" direction="horizontal">
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
  );
}
