
import React from 'react';
import { Check, Trash2, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, todo: Todo) => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onDragStart }: TodoItemProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, todo)}
      className={`flex items-center gap-3 p-3 border border-gray-600 bg-gray-900 hover:bg-gray-800 cursor-move transition-colors rounded ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onToggle(todo.id)}
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
        onClick={() => onDelete(todo.id)}
        className="w-6 h-6 p-0 text-gray-400 hover:text-white"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default TodoItem;
