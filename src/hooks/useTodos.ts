
import { useState, useEffect } from 'react';
import { prisma } from '@/lib/prisma';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  isToday: boolean;
  createdAt: Date;
  tags: Tag[];
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const data = await prisma.task.findMany({
        include: {
          tags: true,
        },
        orderBy: [
          { completed: 'asc' },
          { createdAt: 'desc' },
        ],
      });
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text: string) => {
    try {
      const newTodo = await prisma.task.create({
        data: {
          text,
          completed: false,
          isToday: false,
        },
        include: {
          tags: true,
        },
      });
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = await prisma.task.update({
        where: { id },
        data: { completed: !todo.completed },
        include: {
          tags: true,
        },
      });

      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await prisma.task.delete({
        where: { id },
      });
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const moveToSection = async (todoId: string, isToday: boolean) => {
    try {
      const updatedTodo = await prisma.task.update({
        where: { id: todoId },
        data: { isToday },
        include: {
          tags: true,
        },
      });

      setTodos(todos.map(t => t.id === todoId ? updatedTodo : t));
    } catch (error) {
      console.error('Error moving todo:', error);
    }
  };

  const addTagToTodo = async (todoId: string, tagName: string, tagColor: string = '#666666') => {
    try {
      // First, find or create the tag
      let tag = await prisma.tag.findUnique({
        where: { name: tagName },
      });

      if (!tag) {
        tag = await prisma.tag.create({
          data: {
            name: tagName,
            color: tagColor,
          },
        });
      }

      // Connect the tag to the task
      await prisma.task.update({
        where: { id: todoId },
        data: {
          tags: {
            connect: { id: tag.id },
          },
        },
      });

      // Refresh todos
      fetchTodos();
    } catch (error) {
      console.error('Error adding tag to todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    moveToSection,
    addTagToTodo,
  };
};
