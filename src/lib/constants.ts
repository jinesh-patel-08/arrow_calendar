import type { TaskComplexity, TaskStatus, ViewTab } from "./types";

export const VIEW_TABS: {
  id: ViewTab;
  label: string;
  subtitle: string;
  filter: TaskComplexity | "all";
}[] = [
  {
    id: "linear-year",
    label: "Linear Calendar",
    subtitle: "Full Year · High",
    filter: "High",
  },
  {
    id: "linear-zoom",
    label: "Zoomed Calendar",
    subtitle: "4 Months · Medium",
    filter: "Medium",
  },
  {
    id: "weekly",
    label: "Weekly",
    subtitle: "1 Week · All",
    filter: "all",
  },
  {
    id: "table",
    label: "Table",
    subtitle: "Admin",
    filter: "all",
  },
];

export const COMPLEXITY_COLORS: Record<TaskComplexity, string> = {
  High: "bg-accent-orange/20 text-accent-orange border-accent-orange/40",
  Medium: "bg-accent-blue/20 text-accent-blue border-accent-blue/40",
  Low: "bg-accent-purple/20 text-accent-purple border-accent-purple/40",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  Planned: "bg-terminal-muted/20 text-terminal-muted border-terminal-muted/40",
  "In-Progress":
    "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/40",
  Complete: "bg-accent-green/20 text-accent-green border-accent-green/40",
};

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
