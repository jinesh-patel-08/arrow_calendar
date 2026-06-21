"use client";

import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { useTagsManager } from "@/context/TagContext";
import { useDragDateRange } from "@/hooks/useDragDateRange";
import { useTaskFormModal } from "@/hooks/useTaskFormModal";
import {
  LinearCalendarGrid,
  getRollingMonths,
} from "./LinearCalendarGrid";

interface ZoomedLinearCalendarProps {
  year: number;
}

export function ZoomedLinearCalendar({ year }: ZoomedLinearCalendarProps) {
  const { getTasksByComplexity } = useTasks();
  const { tagColorMap } = useTagsManager();
  const tasks = getTasksByComplexity("Medium");
  const [anchorMonth, setAnchorMonth] = useState(new Date().getMonth());
  const { openCreate, openEdit, modal } = useTaskFormModal("Medium");
  const dragSelection = useDragDateRange(openCreate);

  const monthRows = getRollingMonths(year, anchorMonth, 4);

  const handlePrev = () => {
    setAnchorMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNext = () => {
    setAnchorMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-terminal-border px-6 py-3">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-terminal-muted">
              Zoomed Calendar
            </h2>
            <p className="mt-1 font-mono text-[10px] text-terminal-dim">
              4-month window · Medium complexity · {tasks.length} active · Click
              or drag days to add · Click a task to edit
            </p>
          </div>
          <div className="flex items-center gap-1">
            <NavButton onClick={handlePrev} label="Previous month">
              ‹
            </NavButton>
            <NavButton onClick={handleNext} label="Next month">
              ›
            </NavButton>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 p-4">
          <LinearCalendarGrid
            monthRows={monthRows}
            tasks={tasks}
            minCellHeight={56}
            fillAvailableHeight
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

function NavButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded border border-terminal-border bg-terminal-surface font-mono text-sm text-terminal-muted hover:text-terminal-text"
    >
      {children}
    </button>
  );
}
