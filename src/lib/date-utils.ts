import type { Task } from "./types";

export function parseDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isDateInRange(
  date: Date,
  startIso: string,
  endIso: string,
): boolean {
  const time = date.getTime();
  return (
    time >= parseDate(startIso).getTime() &&
    time <= parseDate(endIso).getTime()
  );
}

export function getWeekStart(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export interface MonthTaskSpan {
  task: Task;
  startCol: number;
  endCol: number;
}

export function getTaskSpansForMonth(
  tasks: Task[],
  year: number,
  month: number,
): MonthTaskSpan[] {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month, daysInMonth(year, month));
  const totalDays = daysInMonth(year, month);

  return tasks
    .filter((task) => {
      const start = parseDate(task.startDate);
      const end = parseDate(task.endDate);
      return start <= monthEnd && end >= monthStart;
    })
    .map((task) => {
      const start = parseDate(task.startDate);
      const end = parseDate(task.endDate);

      const startCol =
        start.getFullYear() === year && start.getMonth() === month
          ? start.getDate()
          : 1;

      const endCol =
        end.getFullYear() === year && end.getMonth() === month
          ? end.getDate()
          : totalDays;

      return { task, startCol, endCol };
    });
}
