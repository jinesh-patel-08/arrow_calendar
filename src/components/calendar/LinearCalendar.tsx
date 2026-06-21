"use client";

import type { Task } from "@/lib/types";
import { useTasks } from "@/context/TaskContext";
import {
  LinearCalendarGrid,
  getYearMonths,
} from "./LinearCalendarGrid";

interface LinearCalendarProps {
  year: number;
}

export function LinearCalendar({ year }: LinearCalendarProps) {
  const { getTasksByComplexity } = useTasks();
  const tasks = getTasksByComplexity("High");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-terminal-border px-6 py-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-terminal-muted">
          Linear Calendar
        </h2>
        <p className="mt-1 font-mono text-[10px] text-terminal-dim">
          Full year view · High complexity tasks only · {tasks.length} active
        </p>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <LinearCalendarGrid
          year={year}
          tasks={tasks}
          months={getYearMonths()}
          cellHeight={40}
        />
      </div>
    </div>
  );
}
