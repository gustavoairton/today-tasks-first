import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  isToday: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: new Date(),
        isToday: false
      };
      setTodos([newTodo, ...todos]);
      setNewTodoText('');
      setIsModalOpen(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const moveToSection = (todoId: string, isToday: boolean) => {
    setTodos(todos.map(todo => 
      todo.id === todoId ? { ...todo, isToday } : todo
    ));
  };

  const todayTodos = todos.filter(todo => todo.isToday).sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const otherTodos = todos.filter(todo => !todo.isToday).sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
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
      className={`flex items-center gap-3 p-3 border border-gray-300 bg-white hover:bg-gray-50 cursor-move transition-colors ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toggleTodo(todo.id)}
        className={`w-6 h-6 rounded-full p-0 border-2 ${
          todo.completed 
            ? 'bg-black text-white border-black' 
            : 'bg-white border-gray-400 hover:border-black'
        }`}
      >
        {todo.completed && <Check className="w-3 h-3" />}
      </Button>
      
      <div className="flex-1">
        <div className={`${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}>
          {todo.text}
        </div>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => deleteTodo(todo.id)}
        className="w-6 h-6 p-0 text-gray-500 hover:text-black"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-black">
          My Todo List
        </h1>
        <p className="text-gray-600">Stay organized and productive</p>
      </div>

      {/* Add Todo Modal */}
      <div className="flex justify-center">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-black">
            <DialogHeader>
              <DialogTitle className="text-black">Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="What needs to be done?"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                className="border-2 border-gray-300 focus:border-black"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addTodo}
                  className="bg-black text-white hover:bg-gray-800"
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
        <h2 className="text-2xl font-bold text-black">To-do today</h2>
        <div
          onDragOver={(e) => handleDragOver(e, true)}
          onDrop={(e) => handleDrop(e, true)}
          className={`min-h-[100px] p-4 border-2 border-dashed border-gray-300 space-y-2 ${
            draggedTodo && !draggedTodo.isToday ? 'border-black bg-gray-50' : ''
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
        <h2 className="text-2xl font-bold text-black">Other tasks</h2>
        <div
          onDragOver={(e) => handleDragOver(e, false)}
          onDrop={(e) => handleDrop(e, false)}
          className={`min-h-[100px] p-4 border-2 border-dashed border-gray-300 space-y-2 ${
            draggedTodo && draggedTodo.isToday ? 'border-black bg-gray-50' : ''
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
  );
};

export default TodoList;
