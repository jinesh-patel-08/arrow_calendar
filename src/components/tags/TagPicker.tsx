"use client";

import { useTagsManager } from "@/context/TagContext";

interface TagPickerProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export function TagPicker({ selectedTags, onChange }: TagPickerProps) {
  const { tags } = useTagsManager();

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onChange(selectedTags.filter((name) => name !== tagName));
    } else {
      onChange([...selectedTags, tagName]);
    }
  };

  if (tags.length === 0) {
    return (
      <p className="font-mono text-xs text-terminal-dim">
        No tags yet. Create tags in the Tags tab first.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.name);

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.name)}
            className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
              isSelected
                ? "border-terminal-text bg-terminal-elevated text-terminal-text"
                : "border-terminal-border bg-terminal-bg text-terminal-muted hover:border-terminal-muted"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
