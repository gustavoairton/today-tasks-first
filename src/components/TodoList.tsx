
import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
  const [filter, setFilter] = useState<'all' | 'today'>('all');

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
        isToday: true
      };
      setTodos([newTodo, ...todos]);
      setNewTodoText('');
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

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Filter and sort todos
  const filteredTodos = todos
    .filter(todo => filter === 'all' || (filter === 'today' && isToday(todo.createdAt)))
    .sort((a, b) => {
      // Sort by completion status first (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by creation date (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  const todayTodosCount = todos.filter(todo => isToday(todo.createdAt) && !todo.completed).length;
  const completedTodayCount = todos.filter(todo => isToday(todo.createdAt) && todo.completed).length;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Todo List
        </h1>
        <p className="text-muted-foreground">Stay organized and productive</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-700">{todayTodosCount}</div>
            <div className="text-sm text-blue-600">Tasks for today</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-700">{completedTodayCount}</div>
            <div className="text-sm text-green-600">Completed today</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Todo */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1"
            />
            <Button onClick={addTodo} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Buttons */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
        >
          All Tasks ({todos.length})
        </Button>
        <Button
          variant={filter === 'today' ? 'default' : 'outline'}
          onClick={() => setFilter('today')}
          className={filter === 'today' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
        >
          Today ({todos.filter(todo => isToday(todo.createdAt)).length})
        </Button>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <div className="text-muted-foreground">
                {filter === 'today' ? 'No tasks for today yet!' : 'No tasks yet!'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Add a task above to get started
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTodos.map((todo) => (
            <Card 
              key={todo.id} 
              className={`transition-all duration-200 hover:shadow-md ${
                todo.completed ? 'bg-gray-50 opacity-75' : 'bg-white hover:bg-blue-50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-8 h-8 rounded-full p-0 ${
                      todo.completed 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 hover:bg-blue-100'
                    }`}
                  >
                    {todo.completed && <Check className="w-4 h-4" />}
                  </Button>
                  
                  <div className="flex-1">
                    <div className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {todo.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {todo.createdAt.toLocaleDateString()}
                      </span>
                      {isToday(todo.createdAt) && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          Today
                        </Badge>
                      )}
                      {todo.completed && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Done
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTodo(todo.id)}
                    className="w-8 h-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
