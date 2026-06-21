"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import type { Task, TaskComplexity } from "@/lib/types";

interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasksByComplexity: (complexity: TaskComplexity | "all") => Task[];
}

const TaskContext = createContext<TaskContextValue | null>(null);

function mapDocToTask(id: string, data: Record<string, unknown>): Task {
  return {
    id,
    name: String(data.name ?? ""),
    startDate: String(data.startDate ?? ""),
    endDate: String(data.endDate ?? ""),
    status: data.status as Task["status"],
    complexity: data.complexity as Task["complexity"],
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !user) {
      setTasks([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const db = getFirebaseDb();
    const tasksRef = collection(db, "users", user.uid, "tasks");

    const unsubscribe = onSnapshot(
      tasksRef,
      (snapshot) => {
        const nextTasks = snapshot.docs.map((document) =>
          mapDocToTask(document.id, document.data()),
        );
        setTasks(nextTasks);
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const addTask = useCallback(
    async (task: Omit<Task, "id">) => {
      if (!user) return;

      const db = getFirebaseDb();
      await addDoc(collection(db, "users", user.uid, "tasks"), {
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    },
    [user],
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      if (!user) return;

      const db = getFirebaseDb();
      const { id: _ignored, ...safeUpdates } = updates as Partial<Task> & {
        id?: string;
      };

      await updateDoc(doc(db, "users", user.uid, "tasks", id), {
        ...safeUpdates,
        updatedAt: new Date().toISOString(),
      });
    },
    [user],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user) return;

      const db = getFirebaseDb();
      await deleteDoc(doc(db, "users", user.uid, "tasks", id));
    },
    [user],
  );

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
      loading,
      error,
      addTask,
      updateTask,
      deleteTask,
      getTasksByComplexity,
    }),
    [tasks, loading, error, addTask, updateTask, deleteTask, getTasksByComplexity],
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
