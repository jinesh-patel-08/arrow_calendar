"use client";

import type { Task } from "@/lib/types";
import { MONTH_LABELS } from "@/lib/constants";
import {
  daysInMonth,
  getTaskSpansForMonth,
  isToday,
} from "@/lib/date-utils";

const MAX_DAY_COLUMNS = 31;

const COMPLEXITY_BAR: Record<Task["complexity"], string> = {
  High: "bg-accent-orange",
  Medium: "bg-accent-blue",
  Low: "bg-accent-purple",
};

interface LinearCalendarGridProps {
  year: number;
  tasks: Task[];
  months: number[];
  cellHeight?: number;
  showMonthLabels?: boolean;
}

export function LinearCalendarGrid({
  year,
  tasks,
  months,
  cellHeight = 36,
  showMonthLabels = true,
}: LinearCalendarGridProps) {
  const today = new Date();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Day number header */}
        <div className="sticky top-0 z-20 flex border-b border-terminal-border bg-terminal-bg">
          {showMonthLabels && (
            <div className="w-12 shrink-0 border-r border-terminal-border" />
          )}
          <div className="flex flex-1">
            {Array.from({ length: MAX_DAY_COLUMNS }, (_, i) => {
              const day = i + 1;
              const isCurrentDay =
                today.getFullYear() === year &&
                today.getMonth() === months[months.length - 1] &&
                today.getDate() === day;

              return (
                <div
                  key={day}
                  className={`flex flex-1 items-center justify-center border-r border-terminal-border/50 py-2 font-mono text-[10px] ${
                    isCurrentDay
                      ? "bg-accent-yellow/10 text-accent-yellow"
                      : "text-terminal-dim"
                  }`}
                  style={{ minWidth: 24 }}
                >
                  {day}
                </div>
              );
            })}
          </div>
          {showMonthLabels && (
            <div className="w-12 shrink-0 border-l border-terminal-border" />
          )}
        </div>

        {/* Month rows */}
        {months.map((month) => {
          const totalDays = daysInMonth(year, month);
          const spans = getTaskSpansForMonth(tasks, year, month);
          const isCurrentMonth =
            today.getFullYear() === year && today.getMonth() === month;

          return (
            <div
              key={month}
              className="relative flex border-b border-terminal-border"
              style={{ minHeight: cellHeight }}
            >
              {showMonthLabels && (
                <div
                  className={`flex w-12 shrink-0 items-center justify-center border-r border-terminal-border font-mono text-xs uppercase tracking-wider ${
                    isCurrentMonth
                      ? "text-accent-yellow"
                      : "text-terminal-muted"
                  }`}
                >
                  {MONTH_LABELS[month]}
                </div>
              )}

              <div className="relative flex flex-1">
                {Array.from({ length: MAX_DAY_COLUMNS }, (_, i) => {
                  const day = i + 1;
                  const isValidDay = day <= totalDays;
                  const cellDate = new Date(year, month, day);
                  const isCurrent =
                    isValidDay && isToday(cellDate) && isCurrentMonth;

                  return (
                    <div
                      key={day}
                      className={`relative flex-1 border-r border-terminal-border/30 ${
                        !isValidDay
                          ? "bg-terminal-bg/50"
                          : day % 2 === 0
                            ? "bg-terminal-surface/40"
                            : "bg-terminal-bg"
                      } ${isCurrent ? "ring-1 ring-inset ring-accent-blue" : ""}`}
                      style={{ minWidth: 24, minHeight: cellHeight }}
                    >
                      {isCurrent && (
                        <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-accent-blue" />
                      )}
                    </div>
                  );
                })}

                {/* Task bars overlay */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-0.5 px-0.5 py-1">
                  {spans.map(({ task, startCol, endCol }) => {
                    const left = ((startCol - 1) / MAX_DAY_COLUMNS) * 100;
                    const width =
                      ((endCol - startCol + 1) / MAX_DAY_COLUMNS) * 100;

                    return (
                      <div
                        key={`${task.id}-${month}`}
                        className={`truncate rounded-sm px-1 font-mono text-[9px] font-bold text-black ${COMPLEXITY_BAR[task.complexity]}`}
                        style={{
                          marginLeft: `${left}%`,
                          width: `${width}%`,
                          maxWidth: `${100 - left}%`,
                        }}
                        title={task.name}
                      >
                        {task.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {showMonthLabels && (
                <div
                  className={`flex w-12 shrink-0 items-center justify-center border-l border-terminal-border font-mono text-xs uppercase tracking-wider ${
                    isCurrentMonth
                      ? "text-accent-yellow"
                      : "text-terminal-muted"
                  }`}
                >
                  {MONTH_LABELS[month]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function getYearMonths(): number[] {
  return Array.from({ length: 12 }, (_, i) => i);
}

export function getRollingMonths(
  year: number,
  anchorMonth: number,
  count = 4,
): { year: number; month: number }[] {
  const result: { year: number; month: number }[] = [];
  let y = year;
  let m = anchorMonth;

  for (let i = 0; i < count; i++) {
    result.push({ year: y, month: m });
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }

  return result;
}
