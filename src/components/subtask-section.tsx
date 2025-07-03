"use client";

import { useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, Subtask } from "@/lib/types";
import {
  generateAndAssignSubtasks,
  toggleSubtaskCompletion,
} from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { taskStore } from "@/lib/store";

// A new component for individual subtasks to manage their own state
function SubtaskItem({
  task,
  subtask,
  index,
  onSubtasksChanged,
}: {
  task: Task;
  subtask: Subtask;
  index: number;
  onSubtasksChanged?: () => void;
}) {
  const [isTogglePending, startToggleTransition] = useTransition();

  const handleToggle = () => {
    startToggleTransition(async () => {
      // Toggle subtask completion in client-side store
      const updatedSubtasks = [...task.subtasks];
      updatedSubtasks[index] = {
        ...updatedSubtasks[index],
        completed: !updatedSubtasks[index].completed,
      };
      await taskStore.updateTask(task.id, { subtasks: updatedSubtasks });
      if (onSubtasksChanged) onSubtasksChanged();
    });
  };

  return (
    <div className="flex items-center gap-3 group">
      <Checkbox
        id={`subtask-${task.id}-${index}`}
        checked={subtask.completed}
        onCheckedChange={handleToggle}
        disabled={isTogglePending || task.completed}
        aria-label={`Mark subtask ${subtask.text} as ${
          subtask.completed ? "incomplete" : "complete"
        }`}
      />
      <label
        htmlFor={`subtask-${task.id}-${index}`}
        className={cn(
          "text-sm flex-1",
          subtask.completed
            ? "text-muted-foreground line-through"
            : "text-foreground",
          task.completed || isTogglePending
            ? "cursor-not-allowed"
            : "cursor-pointer"
        )}
      >
        {subtask.text}
      </label>
      {isTogglePending && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}

export function SubtaskSection({
  task,
  onSubtasksGenerated,
}: {
  task: Task;
  onSubtasksGenerated?: () => void;
}) {
  const [isGenerating, startGenerating] = useTransition();
  const { toast } = useToast();

  const handleGenerateSubtasks = () => {
    startGenerating(async () => {
      const result = await generateAndAssignSubtasks(
        task.id,
        `${task.title}: ${task.description}`
      );
      if (result.error) {
        toast({
          title: "Error generating subtasks",
          description: result.error,
          variant: "destructive",
        });
      } else {
        if (result.subtasks && result.subtasks.length > 0) {
          await taskStore.updateTask(task.id, { subtasks: result.subtasks });
        }
        toast({
          title: "Subtasks generated!",
          description: "AI has created new subtasks for you.",
        });
        if (onSubtasksGenerated) onSubtasksGenerated();
      }
    });
  };

  if (task.subtasks.length === 0 && task.completed) {
    return null;
  }

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={task.subtasks.length > 0 ? "subtasks" : undefined}
    >
      <AccordionItem value="subtasks" className="border-b-0">
        <div className="flex justify-between items-center pr-2">
          <AccordionTrigger className="flex-1 py-1 hover:no-underline">
            <span className="text-sm font-medium">
              {task.subtasks.length > 0
                ? `Subtasks (${completedSubtasks}/${task.subtasks.length})`
                : "AI-Powered Subtasks"}
            </span>
          </AccordionTrigger>
          {!task.completed && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleGenerateSubtasks}
              disabled={isGenerating}
              className="bg-accent/20 text-accent-foreground hover:bg-accent/30"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4 text-accent" />
              )}
              {task.subtasks.length > 0 ? "Regenerate" : "Generate"}
            </Button>
          )}
        </div>
        <AccordionContent>
          {task.subtasks.length > 0 ? (
            <ul className="mt-2 space-y-3 pl-2">
              {task.subtasks.map((subtask, index) => (
                <li key={index}>
                  <SubtaskItem
                    task={task}
                    subtask={subtask}
                    index={index}
                    onSubtasksChanged={onSubtasksGenerated}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground pt-2 pl-2">
              Click 'Generate' to create subtasks for this task using AI.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
