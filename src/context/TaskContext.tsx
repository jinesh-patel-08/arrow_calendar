"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { SAMPLE_TASKS } from "@/lib/sample-data";
import type { Task, TaskComplexity } from "@/lib/types";

type TaskAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; id: string; updates: Partial<Task> }
  | { type: "DELETE_TASK"; id: string };

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, action.task];
    case "UPDATE_TASK":
      return state.map((task) =>
        task.id === action.id ? { ...task, ...action.updates } : task,
      );
    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.id);
    default:
      return state;
  }
}

interface TaskContextValue {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByComplexity: (complexity: TaskComplexity | "all") => Task[];
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, SAMPLE_TASKS);

  const addTask = useCallback((task: Omit<Task, "id">) => {
    dispatch({
      type: "ADD_TASK",
      task: { ...task, id: crypto.randomUUID() },
    });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    dispatch({ type: "UPDATE_TASK", id, updates });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: "DELETE_TASK", id });
  }, []);

  const getTasksByComplexity = useCallback(
    (complexity: TaskComplexity | "all") => {
      if (complexity === "all") return tasks;
      return tasks.filter((task) => task.complexity === complexity);
    },
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      updateTask,
      deleteTask,
      getTasksByComplexity,
    }),
    [tasks, addTask, updateTask, deleteTask, getTasksByComplexity],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
