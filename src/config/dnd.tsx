import { DragDropContext } from 'react-beautiful-dnd';
import { app } from '@kasif/config/app';

export interface DndProviderProps {
  children: React.ReactNode;
}

export function DndProvider(props: DndProviderProps) {
  return (
    <DragDropContext
      onDragStart={app.dndManager.onDragStart}
      onDragUpdate={app.dndManager.onDragUpdate}
      onDragEnd={app.dndManager.onDragEnd}
    >
      {props.children}
    </DragDropContext>
  );
}
