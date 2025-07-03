"use client";

import { useEffect, useState } from "react";
import { taskStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { TaskList } from "./task-list";

export function TaskListLoader() {
  const [tasks, setTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    let mounted = true;
    taskStore.getTasks().then((t) => {
      if (mounted) setTasks(t);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (tasks === null) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Loading tasks...
      </div>
    );
  }

  return <TaskList tasks={tasks} />;
}
