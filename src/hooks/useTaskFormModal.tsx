"use client";

import { useCallback, useState } from "react";
import type { Task, TaskComplexity } from "@/lib/types";
import { useTasks } from "@/context/TaskContext";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";

export function useTaskFormModal(defaultComplexity: TaskComplexity) {
  const { addTask, updateTask, deleteTask } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const openCreate = useCallback((start: string, end: string) => {
    setEditingTask(null);
    setStartDate(start);
    setEndDate(end);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const close = useCallback(() => {
    setFormOpen(false);
    setEditingTask(null);
  }, []);

  const handleUpdate = useCallback(
    async (id: string, data: Omit<Task, "id">) => {
      await updateTask(id, data);
    },
    [updateTask],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteTask(id);
      close();
    },
    [deleteTask, close],
  );

  const modal = (
    <TaskFormModal
      open={formOpen}
      onClose={close}
      task={editingTask}
      initialStartDate={startDate}
      initialEndDate={endDate}
      defaultComplexity={defaultComplexity}
      onCreate={addTask}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );

  return { openCreate, openEdit, modal };
}
