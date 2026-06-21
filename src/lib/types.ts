export type TaskStatus = "Planned" | "In-Progress" | "Complete";

export type TaskComplexity = "High" | "Medium" | "Low";

export interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  complexity: TaskComplexity;
  tags: string[];
}

export interface TagDefinition {
  id: string;
  name: string;
  color: string;
}

export type ViewTab =
  | "linear-year"
  | "linear-zoom"
  | "weekly"
  | "table"
  | "tags";

export const TASK_STATUSES: TaskStatus[] = [
  "Planned",
  "In-Progress",
  "Complete",
];

export const TASK_COMPLEXITIES: TaskComplexity[] = [
  "High",
  "Medium",
  "Low",
];
