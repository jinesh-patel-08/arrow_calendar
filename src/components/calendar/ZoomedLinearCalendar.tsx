"use client";

import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import {
  LinearCalendarGrid,
  getRollingMonths,
} from "./LinearCalendarGrid";

interface ZoomedLinearCalendarProps {
  year: number;
}

export function ZoomedLinearCalendar({ year }: ZoomedLinearCalendarProps) {
  const { getTasksByComplexity } = useTasks();
  const tasks = getTasksByComplexity("Medium");
  const [anchorMonth, setAnchorMonth] = useState(new Date().getMonth());

  const rollingMonths = getRollingMonths(year, anchorMonth, 4);

  const handlePrev = () => {
    setAnchorMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNext = () => {
    setAnchorMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-terminal-border px-6 py-3">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-terminal-muted">
            Zoomed Calendar
          </h2>
          <p className="mt-1 font-mono text-[10px] text-terminal-dim">
            4-month window · Medium complexity · {tasks.length} active
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

      <div className="flex-1 overflow-auto p-4">
        {rollingMonths.map(({ year: rowYear, month }) => (
          <LinearCalendarGrid
            key={`${rowYear}-${month}`}
            year={rowYear}
            tasks={tasks}
            months={[month]}
            cellHeight={56}
          />
        ))}
      </div>
    </div>
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
