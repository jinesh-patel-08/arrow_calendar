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
import { buildTagColorMap } from "@/lib/tag-utils";
import type { TagDefinition } from "@/lib/types";

interface TagContextValue {
  tags: TagDefinition[];
  loading: boolean;
  error: string | null;
  tagColorMap: Map<string, string>;
  addTag: (name: string, color: string) => Promise<void>;
  updateTag: (
    id: string,
    updates: Partial<Pick<TagDefinition, "name" | "color">>,
  ) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  getTagByName: (name: string) => TagDefinition | undefined;
}

const TagContext = createContext<TagContextValue | null>(null);

function mapDocToTag(id: string, data: Record<string, unknown>): TagDefinition {
  return {
    id,
    name: String(data.name ?? ""),
    color: String(data.color ?? "#FFB336"),
  };
}

export function TagProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tags, setTags] = useState<TagDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !user) {
      setTags([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const db = getFirebaseDb();
    const tagsRef = collection(db, "users", user.uid, "tags");

    const unsubscribe = onSnapshot(
      tagsRef,
      (snapshot) => {
        const nextTags = snapshot.docs
          .map((document) => mapDocToTag(document.id, document.data()))
          .sort((a, b) => a.name.localeCompare(b.name));
        setTags(nextTags);
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

  const addTag = useCallback(
    async (name: string, color: string) => {
      if (!user) return;

      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error("Tag name is required.");
      }

      const db = getFirebaseDb();
      await addDoc(collection(db, "users", user.uid, "tags"), {
        name: trimmedName,
        color,
        createdAt: new Date().toISOString(),
      });
    },
    [user],
  );

  const updateTag = useCallback(
    async (
      id: string,
      updates: Partial<Pick<TagDefinition, "name" | "color">>,
    ) => {
      if (!user) return;

      const db = getFirebaseDb();
      const payload: Record<string, string> = {
        updatedAt: new Date().toISOString(),
      };

      if (updates.name !== undefined) {
        payload.name = updates.name.trim();
      }
      if (updates.color !== undefined) {
        payload.color = updates.color;
      }

      await updateDoc(doc(db, "users", user.uid, "tags", id), payload);
    },
    [user],
  );

  const deleteTag = useCallback(
    async (id: string) => {
      if (!user) return;

      const db = getFirebaseDb();
      await deleteDoc(doc(db, "users", user.uid, "tags", id));
    },
    [user],
  );

  const getTagByName = useCallback(
    (name: string) => {
      const normalized = name.trim().toLowerCase();
      return tags.find((tag) => tag.name.toLowerCase() === normalized);
    },
    [tags],
  );

  const tagColorMap = useMemo(() => buildTagColorMap(tags), [tags]);

  const value = useMemo(
    () => ({
      tags,
      loading,
      error,
      tagColorMap,
      addTag,
      updateTag,
      deleteTag,
      getTagByName,
    }),
    [tags, loading, error, tagColorMap, addTag, updateTag, deleteTag, getTagByName],
  );

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
}

export function useTagsManager() {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTagsManager must be used within a TagProvider");
  }
  return context;
}
