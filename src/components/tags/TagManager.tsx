"use client";

import { useEffect, useState } from "react";
import { useTagsManager } from "@/context/TagContext";
import { useTasks } from "@/context/TaskContext";
import { TAG_COLOR_PRESETS } from "@/lib/constants";
import type { TagDefinition } from "@/lib/types";

export function TagManager({ tagsError }: { tagsError?: string | null }) {
  const { tags, loading, addTag } = useTagsManager();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<string>(TAG_COLOR_PRESETS[0]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAddTag = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const duplicate = tags.some(
        (tag) => tag.name.toLowerCase() === newName.trim().toLowerCase(),
      );
      if (duplicate) {
        throw new Error("A tag with this name already exists.");
      }

      await addTag(newName, newColor);
      setNewName("");
      setNewColor(TAG_COLOR_PRESETS[0]);
    } catch (addError) {
      setError(
        addError instanceof Error ? addError.message : "Failed to add tag.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-terminal-border px-6 py-4">
        <h2 className="font-mono text-2xl font-semibold text-terminal-text">
          Tags
        </h2>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-terminal-dim">
          Manage tag colors · Calendar events use the first matching tag color
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {tagsError && (
          <div className="mb-6 rounded border border-red-500/40 bg-red-500/10 p-4 font-mono text-xs leading-relaxed text-red-300">
            <p className="font-bold uppercase tracking-wider">Firestore rules need updating</p>
            <p className="mt-2">
              Go to Firebase Console → Firestore Database → Rules, paste the
              rules from <code className="text-accent-orange">firestore.rules</code> in
              your project, then click Publish. Hard-refresh this page after.
            </p>
          </div>
        )}

        <form
          onSubmit={handleAddTag}
          className="mb-8 rounded border border-terminal-border bg-terminal-surface p-4"
        >
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-terminal-muted">
            New Tag
          </h3>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <label className="flex-1 min-w-[200px]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-terminal-dim">
                Name
              </span>
              <input
                type="text"
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="e.g. work, health"
                className="mt-1 w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-terminal-text outline-none focus:border-accent-orange"
              />
            </label>

            <ColorPicker value={newColor} onChange={setNewColor} label="Color" />

            <button
              type="submit"
              disabled={submitting || !newName.trim()}
              className="rounded bg-accent-orange px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Adding…" : "Add Tag"}
            </button>
          </div>

          {error && (
            <p className="mt-3 font-mono text-xs text-red-300">{error}</p>
          )}
        </form>

        {loading ? (
          <p className="font-mono text-sm text-terminal-dim">Loading tags…</p>
        ) : tags.length === 0 ? (
          <p className="font-mono text-sm text-terminal-dim">
            No tags yet. Add your first tag above.
          </p>
        ) : (
          <div className="space-y-3">
            {tags.map((tag) => (
              <TagRow key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TagRow({ tag }: { tag: TagDefinition }) {
  const { updateTag, deleteTag } = useTagsManager();
  const { tasks, updateTask } = useTasks();
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(tag.name);
    setColor(tag.color);
  }, [tag.name, tag.color]);

  const handleSave = async () => {
    setError(null);
    setSaving(true);

    try {
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error("Tag name is required.");
      }

      if (trimmedName !== tag.name) {
        const affected = tasks.filter((task) => task.tags.includes(tag.name));
        for (const task of affected) {
          await updateTask(task.id, {
            tags: task.tags.map((t) => (t === tag.name ? trimmedName : t)),
          });
        }
      }

      await updateTag(tag.id, { name: trimmedName, color });
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save tag.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setDeleting(true);

    try {
      const affected = tasks.filter((task) => task.tags.includes(tag.name));
      for (const task of affected) {
        await updateTask(task.id, {
          tags: task.tags.filter((t) => t !== tag.name),
        });
      }

      await deleteTag(tag.id);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete tag.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded border border-terminal-border bg-terminal-surface px-4 py-3">
      <span
        className="h-8 w-8 shrink-0 rounded border border-terminal-border"
        style={{ backgroundColor: color }}
      />

      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="min-w-[160px] flex-1 rounded border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-terminal-text outline-none focus:border-accent-orange"
      />

      <ColorPicker value={color} onChange={setColor} label="Color" compact />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || deleting}
          className="rounded border border-terminal-border px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-terminal-muted hover:text-terminal-text disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => void handleDelete()}
          disabled={saving || deleting}
          className="rounded border border-red-500/40 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-red-300 hover:bg-red-500/10 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      {error && (
        <p className="w-full font-mono text-xs text-red-300">{error}</p>
      )}
    </div>
  );
}

function ColorPicker({
  value,
  onChange,
  label,
  compact = false,
}: {
  value: string;
  onChange: (color: string) => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "min-w-[220px]"}>
      {!compact && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-terminal-dim">
          {label}
        </span>
      )}
      <div className={`flex flex-wrap items-center gap-2 ${compact ? "" : "mt-1"}`}>
        {TAG_COLOR_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-label={`Use color ${preset}`}
            onClick={() => onChange(preset)}
            className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
              value.toLowerCase() === preset.toLowerCase()
                ? "border-terminal-text"
                : "border-transparent"
            }`}
            style={{ backgroundColor: preset }}
          />
        ))}
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 w-10 cursor-pointer rounded border border-terminal-border bg-transparent"
          aria-label="Custom color"
        />
      </div>
    </div>
  );
}
