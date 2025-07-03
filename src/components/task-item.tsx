"use client";

import { useState, useTransition, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Check, Edit, MoreVertical, Trash2 } from "lucide-react";

import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { updateTask } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { taskStore } from "@/lib/store";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTaskDialog } from "./edit-task-dialog";
import { DeleteTaskAlert } from "./delete-task-alert";
import { SubtaskSection } from "./subtask-section";

export function TaskItem({
  task,
  onTaskChanged,
}: {
  task: Task;
  onTaskChanged?: () => void;
}) {
  const [isTogglePending, startToggleTransition] = useTransition();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Automatically mark parent as complete if all subtasks are complete, or incomplete if any is incomplete
  useEffect(() => {
    if (task.subtasks.length > 0) {
      const allCompleted = task.subtasks.every((s) => s.completed);
      if (allCompleted && !task.completed) {
        taskStore.updateTask(task.id, { completed: true }).then(() => {
          if (onTaskChanged) onTaskChanged();
        });
      } else if (!allCompleted && task.completed) {
        taskStore.updateTask(task.id, { completed: false }).then(() => {
          if (onTaskChanged) onTaskChanged();
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.subtasks.map((s) => s.completed).join(","), task.completed]);

  const handleToggleCompletion = (checked: boolean) => {
    startToggleTransition(() => {
      if (checked) {
        // Mark all subtasks as completed when completing the parent task
        const updatedSubtasks = task.subtasks.map((s) => ({
          ...s,
          completed: true,
        }));
        taskStore
          .updateTask(task.id, { completed: true, subtasks: updatedSubtasks })
          .then(() => {
            toast({
              title: `Task completed!`,
              description: `"${task.title}" status has been updated.`,
            });
            if (onTaskChanged) onTaskChanged();
          });
      } else {
        // Mark all subtasks as incomplete when unchecking the parent task
        const updatedSubtasks = task.subtasks.map((s) => ({
          ...s,
          completed: false,
        }));
        taskStore
          .updateTask(task.id, { completed: false, subtasks: updatedSubtasks })
          .then(() => {
            toast({
              title: `Task marked as active!`,
              description: `"${task.title}" status has been updated.`,
            });
            if (onTaskChanged) onTaskChanged();
          });
      }
    });
  };

  return (
    <li className="p-4 space-y-3 list-none bg-card/60 rounded-lg border transition-shadow hover:shadow-lg hover:border-primary/50">
      <div className="flex items-start gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleToggleCompletion}
          disabled={isTogglePending}
          aria-label={`Mark task ${task.title} as ${
            task.completed ? "incomplete" : "complete"
          }`}
          className="mt-1"
        />
        <div className="flex-1">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              "font-medium text-base transition-colors cursor-pointer",
              task.completed
                ? "text-muted-foreground line-through"
                : "text-card-foreground"
            )}
          >
            {task.title}
          </label>
          {task.description && (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                task.completed && "line-through"
              )}
            >
              {task.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Created{" "}
            {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 hover:bg-primary"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => setIsEditDialogOpen(true)}
              className="hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setIsDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SubtaskSection task={task} onSubtasksGenerated={onTaskChanged} />

      <EditTaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onTaskChanged={onTaskChanged}
      />
      <DeleteTaskAlert
        task={task}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onTaskChanged={onTaskChanged}
      />
    </li>
  );
}
