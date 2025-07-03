'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating subtasks for a given task using Google Gemini.
 *
 * - generateSubtasks - A function that generates subtasks for a given task.
 * - GenerateSubtasksInput - The input type for the generateSubtasks function.
 * - GenerateSubtasksOutput - The return type for the generateSubtasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSubtasksInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the task for which to generate subtasks.'),
});
export type GenerateSubtasksInput = z.infer<typeof GenerateSubtasksInputSchema>;

const GenerateSubtasksOutputSchema = z.object({
  subtasks: z.array(z.string()).describe('The generated subtasks for the given task.'),
});
export type GenerateSubtasksOutput = z.infer<typeof GenerateSubtasksOutputSchema>;

export async function generateSubtasks(input: GenerateSubtasksInput): Promise<GenerateSubtasksOutput> {
  return generateSubtasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSubtasksPrompt',
  input: {schema: GenerateSubtasksInputSchema},
  output: {schema: GenerateSubtasksOutputSchema},
  prompt: `You are a task management expert. Given a task description, you will generate a list of subtasks required to complete the task.

Task Description: {{{taskDescription}}}

Subtasks:`,
});

const generateSubtasksFlow = ai.defineFlow(
  {
    name: 'generateSubtasksFlow',
    inputSchema: GenerateSubtasksInputSchema,
    outputSchema: GenerateSubtasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
