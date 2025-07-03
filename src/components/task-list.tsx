"use client";

import { useState, useRef, useEffect } from "react";
import type { Task } from "@/lib/types";
import { TaskItem } from "./task-item";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

type FilterValue = "all" | "active" | "completed";

export function TaskList({
  tasks,
  onTaskChanged,
}: {
  tasks: Task[];
  onTaskChanged?: () => void;
}) {
  const filterRef = useRef<FilterValue>("all");
  const [filter, setFilter] = useState<FilterValue>("all");

  // Persist filter in localStorage
  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem("taskFilter")
        : null;
    if (saved === "all" || saved === "active" || saved === "completed") {
      setFilter(saved);
      filterRef.current = saved;
    }
  }, []);

  const handleTabChange = (value: string) => {
    filterRef.current = value as FilterValue;
    setFilter(value as FilterValue);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("taskFilter", value);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground flex flex-col items-center gap-4">
            <Inbox className="h-12 w-12" />
            <div className="space-y-1">
              <p className="text-lg font-medium text-foreground">
                No tasks yet
              </p>
              <p>Get started by creating a new task above.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Tabs value={filter} onValueChange={handleTabChange} className="w-full">
        <div className="p-4 border-b">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={filter} className="m-0">
          {filteredTasks.length > 0 ? (
            <ul className="p-2 space-y-2">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onTaskChanged={onTaskChanged}
                />
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <p>No {filter === "active" ? "pending" : filter} tasks found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
