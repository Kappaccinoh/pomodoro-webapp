export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  allocatedHours: number;
  timeSpent: number;
}

export const DEMO_TASKS: Task[] = [
  {
    id: 1,
    title: "Math Homework",
    status: "in-progress",
    allocatedHours: 6,
    timeSpent: 3600 * 2, // 2 hours spent
  },
  {
    id: 2,
    title: "Read Physics Chapter 5",
    status: "todo",
    allocatedHours: 3,
    timeSpent: 0,
  },
  {
    id: 3,
    title: "Write Essay",
    status: "in-progress",
    allocatedHours: 4,
    timeSpent: 3600 * 1.5, // 1.5 hours spent
  },
  {
    id: 4,
    title: "Review Chemistry Notes",
    status: "completed",
    allocatedHours: 2,
    timeSpent: 3600 * 2, // 2 hours spent (completed)
  }
]; 