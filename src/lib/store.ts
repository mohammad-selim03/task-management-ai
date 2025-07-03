// NOTE: This is a simple localStorage-backed store for demonstration purposes.
// In a real application, you would use a database like Firestore, PostgreSQL, etc.
import type { Task } from "./types";

const TASKS_KEY = "tasks";
const NEXT_ID_KEY = "nextId";

// Helper to check if running in browser
function isBrowser() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

// Helper to get tasks from localStorage
function loadTasks(): Task[] {
  if (!isBrowser()) return [];
  const data = window.localStorage.getItem(TASKS_KEY);
  return data ? (JSON.parse(data) as Task[]) : [];
}

// Helper to save tasks to localStorage
function saveTasks(tasks: Task[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Helper to get nextId from localStorage
function loadNextId(): number {
  if (!isBrowser()) return 1;
  const data = window.localStorage.getItem(NEXT_ID_KEY);
  return data ? Number(data) : 1;
}

// Helper to save nextId to localStorage
function saveNextId(id: number) {
  if (!isBrowser()) return;
  window.localStorage.setItem(NEXT_ID_KEY, String(id));
}

// Typed async helper
const a = async <T>(fn: () => T): Promise<T> =>
  new Promise((res) => setTimeout(() => res(fn()), 50));

export const taskStore = {
  getTasks: async (): Promise<Task[]> =>
    a(() => {
      const tasks = loadTasks();
      return tasks.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }),
  getTask: async (id: string): Promise<Task | undefined> =>
    a(() => {
      const tasks = loadTasks();
      return tasks.find((t) => t.id === id);
    }),
  createTask: async (data: {
    title: string;
    description: string;
  }): Promise<Task> => {
    return a(() => {
      const tasks = loadTasks();
      let nextId = loadNextId();
      const newTask: Task = {
        id: String(nextId++),
        ...data,
        completed: false,
        subtasks: [],
        createdAt: new Date().toISOString(),
      };
      tasks.push(newTask);
      saveTasks(tasks);
      saveNextId(nextId);
      return newTask;
    });
  },
  updateTask: async (
    id: string,
    data: Partial<Omit<Task, "id" | "createdAt">>
  ): Promise<Task | null> => {
    return a(() => {
      const tasks = loadTasks();
      const taskToUpdate = tasks.find((t) => t.id === id);
      if (taskToUpdate) {
        Object.assign(taskToUpdate, data);
        saveTasks(tasks);
        return taskToUpdate;
      }
      return null;
    });
  },
  deleteTask: async (id: string): Promise<{ success: boolean }> => {
    return a(() => {
      const tasks = loadTasks();
      const index = tasks.findIndex((t) => t.id === id);
      if (index > -1) {
        tasks.splice(index, 1);
        saveTasks(tasks);
        return { success: true };
      }
      return { success: false };
    });
  },
};
