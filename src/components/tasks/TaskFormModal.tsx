"use client";

import { useEffect, useState } from "react";
import type { Task, TaskComplexity, TaskStatus } from "@/lib/types";
import { TASK_COMPLEXITIES, TASK_STATUSES } from "@/lib/types";
import { parseDate } from "@/lib/date-utils";
import { TagPicker } from "@/components/tags/TagPicker";

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  initialStartDate: string;
  initialEndDate: string;
  defaultComplexity: TaskComplexity;
  onCreate: (task: Omit<Task, "id">) => Promise<void>;
  onUpdate: (id: string, task: Omit<Task, "id">) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

function formatDisplayDate(iso: string): string {
  const date = parseDate(iso);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateRangeLabel(startDate: string, endDate: string): string {
  if (startDate === endDate) {
    return formatDisplayDate(startDate);
  }
  return `${formatDisplayDate(startDate)} → ${formatDisplayDate(endDate)}`;
}

export function TaskFormModal({
  open,
  onClose,
  task,
  initialStartDate,
  initialEndDate,
  defaultComplexity,
  onCreate,
  onUpdate,
  onDelete,
}: TaskFormModalProps) {
  const isEditing = task != null;

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [status, setStatus] = useState<TaskStatus>("Planned");
  const [complexity, setComplexity] = useState<TaskComplexity>(defaultComplexity);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (task) {
      setName(task.name);
      setStartDate(task.startDate);
      setEndDate(task.endDate);
      setStatus(task.status);
      setComplexity(task.complexity);
      setTags(task.tags);
    } else {
      setName("");
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      setStatus("Planned");
      setComplexity(defaultComplexity);
      setTags([]);
    }

    setError(null);
  }, [open, task, initialStartDate, initialEndDate, defaultComplexity]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Task name is required.");
      return;
    }

    if (endDate < startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    const payload: Omit<Task, "id"> = {
      name: trimmedName,
      startDate,
      endDate,
      status,
        complexity,
        tags,
      };

    setSubmitting(true);

    try {
      if (isEditing && task) {
        await onUpdate(task.id, payload);
      } else {
        await onCreate(payload);
      }
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save task.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !onDelete) return;

    setError(null);
    setDeleting(true);

    try {
      await onDelete(task.id);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete task.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const headerDates = isEditing
    ? formatDateRangeLabel(startDate, endDate)
    : formatDateRangeLabel(initialStartDate, initialEndDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        className="relative z-10 w-full max-w-lg rounded border border-terminal-border bg-terminal-surface shadow-2xl"
      >
        <div className="border-b border-terminal-border px-6 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-orange">
            {isEditing ? "Edit Task" : "New Task"}
          </p>
          <h2
            id="task-form-title"
            className="mt-1 font-mono text-xl font-bold text-terminal-text"
          >
            {isEditing ? name || "Untitled Task" : headerDates}
          </h2>
          <p className="mt-1 font-mono text-xs text-terminal-dim">
            {isEditing
              ? headerDates
              : "Click or drag across days to set a date range. Adjust as needed."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <Field label="Name">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              placeholder="Task name"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date">
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TaskStatus)
                }
                className={inputClass}
              >
                {TASK_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Complexity">
              <select
                value={complexity}
                onChange={(event) =>
                  setComplexity(event.target.value as TaskComplexity)
                }
                className={inputClass}
              >
                {TASK_COMPLEXITIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Tags">
            <TagPicker selectedTags={tags} onChange={setTags} />
          </Field>

          {error && (
            <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 border-t border-terminal-border pt-4">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting || submitting}
                className="rounded border border-red-500/40 px-4 py-2 font-mono text-xs uppercase tracking-wider text-red-300 hover:bg-red-500/10 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-terminal-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-terminal-muted hover:text-terminal-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || deleting}
                className="rounded bg-accent-orange px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black hover:opacity-90 disabled:opacity-50"
              >
                {submitting
                  ? "Saving…"
                  : isEditing
                    ? "Save Changes"
                    : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider text-terminal-muted">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-terminal-text outline-none focus:border-accent-orange";
