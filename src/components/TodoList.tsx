
import React, { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import AddTodoDialog from './AddTodoDialog';
import TodoSection from './TodoSection';

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

const TodoList = () => {
  const { todos, loading, addTodo, toggleTodo, deleteTodo, moveToSection } = useTodos();
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);

  const todayTodos = todos.filter(todo => todo.isToday).sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const otherTodos = todos.filter(todo => !todo.isToday).sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleDragStart = (e: React.DragEvent, todo: Todo) => {
    setDraggedTodo(todo);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, isToday: boolean) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, isToday: boolean) => {
    e.preventDefault();
    if (draggedTodo && draggedTodo.isToday !== isToday) {
      moveToSection(draggedTodo.id, isToday);
    }
    setDraggedTodo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">
            My Todo List
          </h1>
          <p className="text-gray-400">Stay organized and productive</p>
        </div>

        <div className="flex justify-center">
          <AddTodoDialog onAddTodo={addTodo} />
        </div>

        <TodoSection
          title="To-do today"
          todos={todayTodos}
          isToday={true}
          draggedTodo={draggedTodo}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          emptyMessage="No tasks for today. Drag tasks here or add new ones."
        />

        <TodoSection
          title="Other tasks"
          todos={otherTodos}
          isToday={false}
          draggedTodo={draggedTodo}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          emptyMessage="No other tasks. Drag tasks here from today section."
        />
      </div>
    </div>
  );
};

export default TodoList;
