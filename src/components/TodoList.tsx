import React, { useState } from 'react';
import { Plus, Check, Trash2, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTodos } from '@/hooks/useTodos';

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
  const { todos, loading, addTodo, toggleTodo, deleteTodo, moveToSection, addTagToTodo } = useTodos();
  const [newTodoText, setNewTodoText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);

  const handleAddTodo = async () => {
    if (newTodoText.trim()) {
      await addTodo(newTodoText.trim());
      setNewTodoText('');
      setIsModalOpen(false);
    }
  };

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

  const TodoItem = ({ todo }: { todo: Todo }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, todo)}
      className={`flex items-center gap-3 p-3 border border-gray-600 bg-gray-900 hover:bg-gray-800 cursor-move transition-colors rounded ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toggleTodo(todo.id)}
        className={`w-6 h-6 rounded-full p-0 border-2 ${
          todo.completed 
            ? 'bg-white text-black border-white' 
            : 'bg-transparent border-gray-400 hover:border-white text-white'
        }`}
      >
        {todo.completed && <Check className="w-3 h-3" />}
      </Button>
      
      <div className="flex-1">
        <div className={`${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
          {todo.text}
        </div>
        {todo.tags.length > 0 && (
          <div className="flex gap-1 mt-1">
            {todo.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                style={{ backgroundColor: tag.color + '33' }}
              >
                <TagIcon className="w-3 h-3" />
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => deleteTodo(todo.id)}
        className="w-6 h-6 p-0 text-gray-400 hover:text-white"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );

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

        {/* Add Todo Modal */}
        <div className="flex justify-center">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="w-4 h-4 mr-2" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                  className="border-gray-600 bg-gray-800 text-white focus:border-white"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddTodo}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Add Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* To-do Today Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">To-do today</h2>
          <div
            onDragOver={(e) => handleDragOver(e, true)}
            onDrop={(e) => handleDrop(e, true)}
            className={`min-h-[100px] p-4 border-2 border-dashed border-gray-600 space-y-2 rounded ${
              draggedTodo && !draggedTodo.isToday ? 'border-white bg-gray-900' : ''
            }`}
          >
            {todayTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tasks for today. Drag tasks here or add new ones.
              </div>
            ) : (
              todayTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))
            )}
          </div>
        </div>

        {/* Other Tasks Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Other tasks</h2>
          <div
            onDragOver={(e) => handleDragOver(e, false)}
            onDrop={(e) => handleDrop(e, false)}
            className={`min-h-[100px] p-4 border-2 border-dashed border-gray-600 space-y-2 rounded ${
              draggedTodo && draggedTodo.isToday ? 'border-white bg-gray-900' : ''
            }`}
          >
            {otherTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No other tasks. Drag tasks here from today section.
              </div>
            ) : (
              otherTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
