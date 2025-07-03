'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { taskStore } from '@/lib/store';
import { generateSubtasks } from '@/ai/flows/generate-subtasks';
import type { Task } from '@/lib/types';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string(),
});

export async function createTask(data: { title: string; description: string }) {
  const parsed = createTaskSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error('Invalid task data');
  }

  await taskStore.createTask(parsed.data);

  revalidatePath('/');
}

export async function updateTask(task: Partial<Task> & { id: string }) {
  await taskStore.updateTask(task.id, task);
  revalidatePath('/');
}

export async function deleteTask(id: string) {
  await taskStore.deleteTask(id);
  revalidatePath('/');
}

export async function generateAndAssignSubtasks(taskId: string, taskDescription: string) {
  try {
    const { subtasks } = await generateSubtasks({ taskDescription });
    if (subtasks && subtasks.length > 0) {
      const newSubtasks = subtasks.map(text => ({ text, completed: false }));
      await taskStore.updateTask(taskId, { subtasks: newSubtasks });
      revalidatePath('/');
      return { subtasks: newSubtasks };
    }
    return { subtasks: [] };
  } catch (error) {
    console.error('Error generating subtasks:', error);
    return { error: 'Failed to generate subtasks.' };
  }
}

export async function toggleSubtaskCompletion(taskId: string, subtaskIndex: number) {
  const task = await taskStore.getTask(taskId);

  if (!task) {
    throw new Error('Task not found');
  }

  const updatedSubtasks = [...task.subtasks];
  const subtask = updatedSubtasks[subtaskIndex];
  
  if (subtask) {
    subtask.completed = !subtask.completed;
    await taskStore.updateTask(taskId, { subtasks: updatedSubtasks });
    revalidatePath('/');
  }
}
