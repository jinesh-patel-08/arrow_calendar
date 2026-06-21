import type { TaskComplexity, TaskStatus } from "@/lib/types";
import {
  COMPLEXITY_COLORS,
  STATUS_COLORS,
} from "@/lib/constants";

interface BadgeProps {
  label: string;
  variant: "complexity" | "status";
  value: TaskComplexity | TaskStatus;
}

export function Badge({ label, variant, value }: BadgeProps) {
  const colorClass =
    variant === "complexity"
      ? COMPLEXITY_COLORS[value as TaskComplexity]
      : STATUS_COLORS[value as TaskStatus];

  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${colorClass}`}
    >
      {label}
    </span>
  );
}
