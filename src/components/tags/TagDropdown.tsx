"use client";

import { useTagsManager } from "@/context/TagContext";

interface TagDropdownProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export function TagDropdown({ selectedTags, onChange }: TagDropdownProps) {
  const { tags } = useTagsManager();

  if (tags.length === 0) {
    return (
      <span className="font-mono text-xs text-terminal-dim">
        No tags — add in Tags tab
      </span>
    );
  }

  const unselectedTags = tags.filter((tag) => !selectedTags.includes(tag.name));

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tagName = event.target.value;
    if (!tagName) return;
    onChange([...selectedTags, tagName]);
    event.target.value = "";
  };

  return (
    <div className="min-w-[140px] space-y-1.5">
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tagName) => {
            const tag = tags.find((item) => item.name === tagName);

            return (
              <span
                key={tagName}
                className="inline-flex items-center gap-1 rounded border border-terminal-border bg-terminal-elevated px-1.5 py-0.5 font-mono text-[10px] text-terminal-text"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: tag?.color ?? "#666" }}
                />
                {tagName}
                <button
                  type="button"
                  onClick={() =>
                    onChange(selectedTags.filter((name) => name !== tagName))
                  }
                  className="ml-0.5 leading-none text-terminal-dim hover:text-terminal-text"
                  aria-label={`Remove ${tagName}`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      <select
        value=""
        onChange={handleSelect}
        disabled={unselectedTags.length === 0}
        className="w-full rounded border border-transparent bg-transparent px-1 py-1 font-mono text-xs text-terminal-muted outline-none focus:border-terminal-border focus:bg-terminal-elevated disabled:opacity-50"
      >
        <option value="">
          {unselectedTags.length === 0
            ? "All tags selected"
            : selectedTags.length === 0
              ? "Select tag…"
              : "Add tag…"}
        </option>
        {unselectedTags.map((tag) => (
          <option key={tag.id} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
}
