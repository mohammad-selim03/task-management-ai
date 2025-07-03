export type Subtask = {
  text: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: string;
};
