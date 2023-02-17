import { Group } from '@mantine/core';
// import { ReactComponent as JS } from '@kasif/assets/icons/folder-javascript.svg';
// import { ReactComponent as Downloads } from '@kasif/assets/icons/folder-download.svg';
import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  MouseSensor,
  TouchSensor,
  Announcements,
  ScreenReaderInstructions,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { app } from '@kasif/config/app';
import { useSlice } from '@kasif/util/cinq-react';
import { TabItem } from './TabItem';

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable: `
    To pick up a sortable item, press the space bar.
    While sorting, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
};

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export function Tabs() {
  const [{ views: items, currentView }] = useSlice(app.viewManager.store);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const isFirstAnnouncement = useRef(true);
  const getIndex = (id: UniqueIdentifier) => items.findIndex((item) => item.id === id);
  const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1;
  const activeIndex = activeId ? getIndex(activeId) : -1;

  const activationConstraint = {
    distance: 15,
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint,
    }),
    useSensor(TouchSensor, {
      activationConstraint,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const announcements: Announcements = {
    onDragStart({ active: { id } }) {
      return `Picked up sortable item ${String(
        id
      )}. Sortable item ${id} is in position ${getPosition(id)} of ${items.length}`;
    },
    onDragOver({ active, over }) {
      if (isFirstAnnouncement.current === true) {
        isFirstAnnouncement.current = false;
        return;
      }

      if (over) {
        return `Sortable item ${active.id} was moved into position ${getPosition(over.id)} of ${
          items.length
        }`;
      }
    },
    onDragEnd({ active, over }) {
      if (over) {
        return `Sortable item ${active.id} was dropped at position ${getPosition(over.id)} of ${
          items.length
        }`;
      }
    },
    onDragCancel({ active: { id } }) {
      return `Sorting was cancelled. Sortable item ${id} was dropped and returned to position ${getPosition(
        id
      )} of ${items.length}.`;
    },
  };

  useEffect(() => {
    if (!activeId) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  return (
    <DndContext
      accessibility={{
        announcements,
        screenReaderInstructions,
      }}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        if (!active) {
          return;
        }

        setActiveId(active.id);
      }}
      onDragEnd={({ over }) => {
        setActiveId(null);

        if (over) {
          const overIndex = getIndex(over.id);
          if (activeIndex !== overIndex) {
            app.viewManager.store.setKey('views', (oldItems) =>
              arrayMove(oldItems, activeIndex, overIndex)
            );
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
    >
      <Group
        sx={{
          height: '100%',
          gap: 6,
          flexWrap: 'nowrap',
        }}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((view) => (
            <TabItem
              key={view.id}
              active={view.id === currentView}
              beforeActive={
                items.findIndex((item) => item.id === currentView)! ===
                items.findIndex((item) => item.id === view.id)! + 1
              }
              onClick={(id) => app.viewManager.setCurrentView(id)}
              {...view}
            />
          ))}
        </SortableContext>
      </Group>

      {createPortal(
        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {activeId ? (
            <TabItem
              active={items.find((item) => item.id === activeId)!.id === currentView}
              {...items.find((item) => item.id === activeId)!}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
