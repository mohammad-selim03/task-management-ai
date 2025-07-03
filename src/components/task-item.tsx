"use client";

import { useState, useTransition } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, Edit, MoreVertical, Trash2 } from 'lucide-react';

import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { updateTask } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditTaskDialog } from './edit-task-dialog';
import { DeleteTaskAlert } from './delete-task-alert';
import { SubtaskSection } from './subtask-section';

export function TaskItem({ task }: { task: Task }) {
  const [isTogglePending, startToggleTransition] = useTransition();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleToggleCompletion = () => {
    startToggleTransition(() => {
      updateTask({ id: task.id, completed: !task.completed }).then(() => {
        toast({
          title: `Task ${!task.completed ? 'completed' : 'marked as active'}!`,
          description: `"${task.title}" status has been updated.`,
        });
      });
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
          aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
          className="mt-1"
        />
        <div className="flex-1">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              'font-medium text-base transition-colors cursor-pointer',
              task.completed ? 'text-muted-foreground line-through' : 'text-card-foreground'
            )}
          >
            {task.title}
          </label>
          {task.description && (
            <p className={cn('text-sm text-muted-foreground', task.completed && 'line-through')}>
              {task.description}
            </p>
          )}
           <p className="text-xs text-muted-foreground mt-1">
            Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
          </p>
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
      <SubtaskSection task={task} />
      
      <EditTaskDialog task={task} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      <DeleteTaskAlert task={task} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
    </li>
  );
}
