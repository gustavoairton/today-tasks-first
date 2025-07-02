
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AddTodoDialogProps {
  onAddTodo: (text: string) => Promise<void>;
}

const AddTodoDialog = ({ onAddTodo }: AddTodoDialogProps) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTodo = async () => {
    if (newTodoText.trim()) {
      await onAddTodo(newTodoText.trim());
      setNewTodoText('');
      setIsModalOpen(false);
    }
  };

  return (
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
  );
};

export default AddTodoDialog;
