"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";
import { DAY_LABELS } from "@/lib/constants";
import { useTasks } from "@/context/TaskContext";
import { Badge } from "@/components/ui/Badge";
import {
  addDays,
  formatDateISO,
  getWeekStart,
  isDateInRange,
  isToday,
  parseDate,
} from "@/lib/date-utils";

interface WeeklyCalendarProps {
  year: number;
}

export function WeeklyCalendar({ year }: WeeklyCalendarProps) {
  const { tasks } = useTasks();
  const [weekStart, setWeekStart] = useState(() =>
    getWeekStart(new Date(year, new Date().getMonth(), new Date().getDate())),
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const weekTasks = tasks.filter((task) =>
    weekDays.some((day) => isDateInRange(day, task.startDate, task.endDate)),
  );

  const handlePrev = () => setWeekStart((prev) => addDays(prev, -7));
  const handleNext = () => setWeekStart((prev) => addDays(prev, 7));
  const handleToday = () => setWeekStart(getWeekStart(new Date()));

  const weekLabel = `${formatDateISO(weekDays[0])} — ${formatDateISO(weekDays[6])}`;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-terminal-border px-6 py-3">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-terminal-muted">
            Weekly Calendar
          </h2>
          <p className="mt-1 font-mono text-[10px] text-terminal-dim">
            {weekLabel} · All complexities · {weekTasks.length} tasks
          </p>
        </div>
        <div className="flex items-center gap-1">
          <NavButton onClick={handlePrev} label="Previous week">
            ‹
          </NavButton>
          <NavButton onClick={handleToday} label="This week">
            Today
          </NavButton>
          <NavButton onClick={handleNext} label="Next week">
            ›
          </NavButton>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded border border-terminal-border bg-terminal-border">
          {weekDays.map((day, index) => {
            const dayTasks = getTasksForDay(tasks, day);
            const current = isToday(day);

            return (
              <div
                key={formatDateISO(day)}
                className={`flex min-h-[320px] flex-col bg-terminal-bg ${
                  current ? "ring-1 ring-inset ring-accent-blue" : ""
                }`}
              >
                <div
                  className={`border-b border-terminal-border px-3 py-2 ${
                    current ? "bg-accent-yellow/10" : "bg-terminal-surface"
                  }`}
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-terminal-dim">
                    {DAY_LABELS[index]}
                  </div>
                  <div
                    className={`font-mono text-xl font-bold ${
                      current ? "text-accent-yellow" : "text-terminal-text"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-2">
                  {dayTasks.length === 0 ? (
                    <span className="font-mono text-[10px] text-terminal-dim">
                      —
                    </span>
                  ) : (
                    dayTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getTasksForDay(tasks: Task[], day: Date): Task[] {
  const iso = formatDateISO(day);
  return tasks.filter(
    (task) => iso >= task.startDate && iso <= task.endDate,
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded border border-terminal-border bg-terminal-surface p-2">
      <p className="truncate font-mono text-xs font-bold text-terminal-text">
        {task.name}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        <Badge label={task.complexity} variant="complexity" value={task.complexity} />
        <Badge label={task.status} variant="status" value={task.status} />
      </div>
      {task.tags.length > 0 && (
        <p className="mt-1 truncate font-mono text-[9px] text-terminal-dim">
          {task.tags.join(" · ")}
        </p>
      )}
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
      className="rounded border border-terminal-border bg-terminal-surface px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-terminal-muted hover:text-terminal-text"
    >
      {children}
    </button>
  );
}
