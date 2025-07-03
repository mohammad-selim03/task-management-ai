// NOTE: This is a simple in-memory store for demonstration purposes.
// In a real application, you would use a database like Firestore, PostgreSQL, etc.
import type { Task } from './types';

let tasks: Task[] = [];

let nextId = 1;

const a = (fn: () => any) => new Promise(res => setTimeout(() => res(fn()), 50));

export const taskStore = {
  getTasks: async (): Promise<Task[]> => a(() => tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())),
  getTask: async (id: string): Promise<Task | undefined> => a(() => tasks.find(t => t.id === id)),
  createTask: async (data: { title: string; description: string }): Promise<Task> => {
    const newTask: Task = {
      id: String(nextId++),
      ...data,
      completed: false,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return a(() => newTask);
  },
  updateTask: async (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> => {
    const taskToUpdate = tasks.find(t => t.id === id);
    if (taskToUpdate) {
      Object.assign(taskToUpdate, data);
      return a(() => taskToUpdate);
    }
    return a(() => null);
  },
  deleteTask: async (id: string): Promise<{ success: boolean }> => {
    const index = tasks.findIndex(t => t.id === id);
    if (index > -1) {
      tasks.splice(index, 1);
      return a(() => ({ success: true }));
    }
    return a(() => ({ success: false }));
  },
};
