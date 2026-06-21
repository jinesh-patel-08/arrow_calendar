"use client";

import type { DragDateRange } from "@/hooks/useDragDateRange";
import type { Task } from "@/lib/types";
import { MONTH_LABELS } from "@/lib/constants";
import { getContrastTextColor, getTaskBarColor } from "@/lib/tag-utils";
import {
  assignTaskLanes,
  daysInMonth,
  formatDateISO,
  getTaskSpansForMonth,
  isToday,
} from "@/lib/date-utils";

const MAX_DAY_COLUMNS = 31;
const TASK_BAR_HEIGHT = 18;
const TASK_BAR_GAP = 3;
const ROW_PADDING_Y = 8;

export interface MonthRow {
  year: number;
  month: number;
}

interface LinearCalendarGridProps {
  monthRows: MonthRow[];
  tasks: Task[];
  minCellHeight?: number;
  showMonthLabels?: boolean;
  showDayHeader?: boolean;
  fillAvailableHeight?: boolean;
  dragSelection: DragDateRange;
  onTaskClick?: (task: Task) => void;
  tagColorMap: Map<string, string>;
}

function getMonthRowHeight(laneCount: number, minCellHeight: number): number {
  if (laneCount === 0) return minCellHeight;

  const taskStackHeight =
    ROW_PADDING_Y * 2 +
    laneCount * TASK_BAR_HEIGHT +
    (laneCount - 1) * TASK_BAR_GAP;

  return Math.max(minCellHeight, taskStackHeight);
}

export function LinearCalendarGrid({
  monthRows,
  tasks,
  minCellHeight = 36,
  showMonthLabels = true,
  showDayHeader = true,
  fillAvailableHeight = false,
  dragSelection,
  onTaskClick,
  tagColorMap,
}: LinearCalendarGridProps) {
  const today = new Date();
  const { startDrag, extendDrag, isInRange, isDragging } = dragSelection;

  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  return (
    <div
      className={`flex min-h-0 flex-col overflow-x-auto ${fillAvailableHeight ? "h-full flex-1" : ""} ${isDragging ? "select-none" : ""}`}
    >
      <div className={`min-w-[900px] ${fillAvailableHeight ? "flex h-full min-h-0 flex-1 flex-col" : ""}`}>
        {showDayHeader && (
          <div className="sticky top-0 z-20 flex shrink-0 border-b border-terminal-border bg-terminal-bg">
            {showMonthLabels && (
              <div className="w-12 shrink-0 border-r border-terminal-border" />
            )}
            <div className="flex flex-1">
              {Array.from({ length: MAX_DAY_COLUMNS }, (_, i) => {
                const day = i + 1;
                const isCurrentDay =
                  day === todayDay &&
                  monthRows.some(
                    (row) => row.year === todayYear && row.month === todayMonth,
                  );

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
        )}

        <div
          className={fillAvailableHeight ? "flex min-h-0 flex-1 flex-col" : ""}
        >
          {monthRows.map(({ year, month }) => {
            const totalDays = daysInMonth(year, month);
            const spans = getTaskSpansForMonth(tasks, year, month);
            const { placed, laneCount } = assignTaskLanes(spans);
            const rowHeight = getMonthRowHeight(laneCount, minCellHeight);
            const isCurrentMonth =
              today.getFullYear() === year && today.getMonth() === month;

            return (
              <div
                key={`${year}-${month}`}
                className={`relative flex border-b border-terminal-border ${fillAvailableHeight ? "min-h-0 flex-1" : ""}`}
                style={fillAvailableHeight ? { minHeight: rowHeight } : { minHeight: rowHeight, height: rowHeight }}
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

                <div className="relative min-h-0 flex-1">
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: MAX_DAY_COLUMNS }, (_, i) => {
                      const day = i + 1;
                      const isValidDay = day <= totalDays;
                      const cellDate = new Date(year, month, day);
                      const isCurrent =
                        isValidDay && isToday(cellDate) && isCurrentMonth;
                      const dateIso = formatDateISO(cellDate);
                      const inRange = isValidDay && isInRange(dateIso);

                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={!isValidDay}
                          onMouseDown={(event) => {
                            if (!isValidDay) return;
                            event.preventDefault();
                            startDrag(dateIso);
                          }}
                          onMouseEnter={() => {
                            if (isValidDay) extendDrag(dateIso);
                          }}
                          aria-label={
                            isValidDay
                              ? `Select date range starting or ending on ${dateIso}`
                              : undefined
                          }
                          className={`relative h-full flex-1 border-r border-terminal-border/30 text-left ${
                            !isValidDay
                              ? "cursor-default bg-terminal-bg/50"
                              : inRange
                                ? "cursor-crosshair bg-accent-orange/30"
                                : "cursor-crosshair bg-terminal-bg hover:bg-terminal-elevated/80"
                          } ${isValidDay && day % 2 === 0 && !inRange ? "bg-terminal-surface/40" : ""} ${isCurrent ? "ring-1 ring-inset ring-accent-blue" : ""}`}
                          style={{ minWidth: 24 }}
                        >
                          {isCurrent && (
                            <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-accent-blue" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pointer-events-none absolute inset-0">
                    {placed.map(({ task, startCol, endCol, lane }) => {
                      const left = ((startCol - 1) / MAX_DAY_COLUMNS) * 100;
                      const width =
                        ((endCol - startCol + 1) / MAX_DAY_COLUMNS) * 100;
                      const barColor = getTaskBarColor(task, tagColorMap);
                      const textColor = getContrastTextColor(barColor);
                      const top =
                        ROW_PADDING_Y + lane * (TASK_BAR_HEIGHT + TASK_BAR_GAP);

                      return (
                        <button
                          key={`${task.id}-${year}-${month}`}
                          type="button"
                          onMouseDown={(event) => event.stopPropagation()}
                          onClick={(event) => {
                            event.stopPropagation();
                            onTaskClick?.(task);
                          }}
                          className="pointer-events-auto absolute truncate rounded-sm px-1 text-left font-mono text-[9px] font-bold transition-opacity hover:opacity-80"
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            top,
                            height: TASK_BAR_HEIGHT,
                            backgroundColor: barColor,
                            color: textColor,
                          }}
                          title={`Edit: ${task.name}`}
                        >
                          {task.name}
                        </button>
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
    </div>
  );
}

export function getYearMonthRows(year: number): MonthRow[] {
  return Array.from({ length: 12 }, (_, month) => ({ year, month }));
}

export function getRollingMonths(
  year: number,
  anchorMonth: number,
  count = 4,
): MonthRow[] {
  const result: MonthRow[] = [];
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

// Back-compat alias
export function getYearMonths(): number[] {
  return Array.from({ length: 12 }, (_, i) => i);
}
