
import React from 'react';
import TodoItem from './TodoItem';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  isToday: boolean;
  tags: Tag[];
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TodoSectionProps {
  title: string;
  todos: Todo[];
  isToday: boolean;
  draggedTodo: Todo | null;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
  onDragOver: (e: React.DragEvent, isToday: boolean) => void;
  onDrop: (e: React.DragEvent, isToday: boolean) => void;
  emptyMessage: string;
}

const TodoSection = ({
  title,
  todos,
  isToday,
  draggedTodo,
  onToggleTodo,
  onDeleteTodo,
  onDragStart,
  onDragOver,
  onDrop,
  emptyMessage
}: TodoSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div
        onDragOver={(e) => onDragOver(e, isToday)}
        onDrop={(e) => onDrop(e, isToday)}
        className={`min-h-[100px] p-4 border-2 border-dashed border-gray-600 space-y-2 rounded ${
          draggedTodo && draggedTodo.isToday !== isToday ? 'border-white bg-gray-900' : ''
        }`}
      >
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggleTodo}
              onDelete={onDeleteTodo}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoSection;
