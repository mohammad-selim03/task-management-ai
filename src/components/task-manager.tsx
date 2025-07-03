"use client";

import { useEffect, useState } from "react";
import { taskStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { CreateTaskForm } from "./create-task-form";
import { TaskList } from "./task-list";

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    taskStore.getTasks().then((t) => {
      if (mounted) {
        setTasks(t);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const reloadTasks = async () => {
    setLoading(true);
    const t = await taskStore.getTasks();
    setTasks(t);
    setLoading(false);
  };

  const handleTaskCreated = async (data: {
    title: string;
    description: string;
  }) => {
    await taskStore.createTask(data);
    await reloadTasks();
  };

  return (
    <>
      <CreateTaskForm onTaskCreated={handleTaskCreated} />
      <div style={{ position: "relative" }}>
        <TaskList tasks={tasks} onTaskChanged={reloadTasks} />
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <span className="text-muted-foreground">Loading tasks...</span>
          </div>
        )}
      </div>
    </>
  );
}
