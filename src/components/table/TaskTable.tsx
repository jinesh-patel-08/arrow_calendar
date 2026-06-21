"use client";

import { useState } from "react";
import type { Task, TaskComplexity, TaskStatus } from "@/lib/types";
import {
  TASK_COMPLEXITIES,
  TASK_STATUSES,
} from "@/lib/types";
import { useTasks } from "@/context/TaskContext";
import { Badge } from "@/components/ui/Badge";
import { formatDateISO } from "@/lib/date-utils";

export function TaskTable() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const handleAddTask = () => {
    const today = formatDateISO(new Date());
    addTask({
      name: "New Task",
      startDate: today,
      endDate: today,
      status: "Planned",
      complexity: "Low",
      tags: [],
    });
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-terminal-border px-6 py-4">
        <div>
          <h2 className="font-mono text-2xl font-semibold text-terminal-text">
            Tasks
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-terminal-dim">
            Table · Admin · Inline editing
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddTask}
          className="rounded-md bg-accent-blue px-4 py-2 font-mono text-xs font-medium text-white transition-colors hover:bg-accent-blue/80"
        >
          + New
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-terminal-border bg-terminal-surface">
              <Th icon="◎">Complexity</Th>
              <Th icon="Aa">Name</Th>
              <Th icon="📅">Start Date</Th>
              <Th icon="📅">End Date</Th>
              <Th icon="○">Status</Th>
              <Th icon="≡">Tags</Th>
              <Th icon=""> </Th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center font-mono text-sm text-terminal-dim"
                >
                  No tasks yet. Click &quot;+ New&quot; to add one.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onUpdate={(updates) => updateTask(task.id, updates)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))
            )}
          </tbody>
        </table>

        <button
          type="button"
          onClick={handleAddTask}
          className="w-full border-b border-terminal-border px-6 py-3 text-left font-mono text-sm text-terminal-dim transition-colors hover:bg-terminal-surface hover:text-terminal-muted"
        >
          + New page
        </button>
      </div>
    </div>
  );
}

function Th({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: string;
}) {
  return (
    <th className="px-4 py-3 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-terminal-dim">
      <span className="mr-1.5 opacity-60">{icon}</span>
      {children}
    </th>
  );
}

function TaskRow({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}) {
  const [editingTags, setEditingTags] = useState(false);
  const [tagsInput, setTagsInput] = useState(task.tags.join(", "));

  const commitTags = () => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onUpdate({ tags });
    setEditingTags(false);
  };

  return (
    <tr className="group border-b border-terminal-border/60 transition-colors hover:bg-terminal-surface/50">
      <td className="px-4 py-2">
        <select
          value={task.complexity}
          onChange={(e) =>
            onUpdate({ complexity: e.target.value as TaskComplexity })
          }
          className="w-full rounded border border-transparent bg-transparent px-1 py-1 font-mono text-xs text-terminal-text outline-none focus:border-terminal-border focus:bg-terminal-elevated"
        >
          {TASK_COMPLEXITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Badge
          label={task.complexity}
          variant="complexity"
          value={task.complexity}
        />
      </td>

      <td className="px-4 py-2">
        <input
          type="text"
          value={task.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full rounded border border-transparent bg-transparent px-1 py-1 font-mono text-sm text-terminal-text outline-none focus:border-terminal-border focus:bg-terminal-elevated"
        />
      </td>

      <td className="px-4 py-2">
        <input
          type="date"
          value={task.startDate}
          onChange={(e) => onUpdate({ startDate: e.target.value })}
          className="rounded border border-transparent bg-transparent px-1 py-1 font-mono text-xs text-terminal-muted outline-none focus:border-terminal-border focus:bg-terminal-elevated"
        />
      </td>

      <td className="px-4 py-2">
        <input
          type="date"
          value={task.endDate}
          onChange={(e) => onUpdate({ endDate: e.target.value })}
          className="rounded border border-transparent bg-transparent px-1 py-1 font-mono text-xs text-terminal-muted outline-none focus:border-terminal-border focus:bg-terminal-elevated"
        />
      </td>

      <td className="px-4 py-2">
        <select
          value={task.status}
          onChange={(e) => onUpdate({ status: e.target.value as TaskStatus })}
          className="w-full rounded border border-transparent bg-transparent px-1 py-1 font-mono text-xs text-terminal-text outline-none focus:border-terminal-border focus:bg-terminal-elevated"
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Badge label={task.status} variant="status" value={task.status} />
      </td>

      <td className="px-4 py-2">
        {editingTags ? (
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onBlur={commitTags}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTags();
              if (e.key === "Escape") {
                setTagsInput(task.tags.join(", "));
                setEditingTags(false);
              }
            }}
            autoFocus
            placeholder="tag1, tag2"
            className="w-full rounded border border-terminal-border bg-terminal-elevated px-2 py-1 font-mono text-xs text-terminal-text outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setTagsInput(task.tags.join(", "));
              setEditingTags(true);
            }}
            className="w-full rounded px-1 py-1 text-left font-mono text-xs text-terminal-muted hover:bg-terminal-elevated"
          >
            {task.tags.length > 0 ? task.tags.join(", ") : "Add tags…"}
          </button>
        )}
      </td>

      <td className="px-4 py-2">
        <button
          type="button"
          onClick={onDelete}
          className="rounded px-2 py-1 font-mono text-[10px] text-terminal-dim opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
