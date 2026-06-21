"use client";

import { useTasks } from "@/context/TaskContext";
import { useTagsManager } from "@/context/TagContext";
import { useDragDateRange } from "@/hooks/useDragDateRange";
import { useTaskFormModal } from "@/hooks/useTaskFormModal";
import {
  LinearCalendarGrid,
  getYearMonthRows,
} from "./LinearCalendarGrid";

interface LinearCalendarProps {
  year: number;
}

export function LinearCalendar({ year }: LinearCalendarProps) {
  const { getTasksByComplexity } = useTasks();
  const { tagColorMap } = useTagsManager();
  const tasks = getTasksByComplexity("High");
  const { openCreate, openEdit, modal } = useTaskFormModal("High");
  const dragSelection = useDragDateRange(openCreate);

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-terminal-border px-6 py-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-terminal-muted">
            Linear Calendar
          </h2>
          <p className="mt-1 font-mono text-[10px] text-terminal-dim">
            Full year view · High complexity · {tasks.length} active · Click or
            drag days to add · Click a task to edit
          </p>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <LinearCalendarGrid
            monthRows={getYearMonthRows(year)}
            tasks={tasks}
            minCellHeight={40}
            dragSelection={dragSelection}
            onTaskClick={openEdit}
            tagColorMap={tagColorMap}
          />
        </div>
      </div>

      {modal}
    </>
  );
}
