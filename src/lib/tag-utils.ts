import type { Task, TaskComplexity } from "./types";

const COMPLEXITY_HEX: Record<TaskComplexity, string> = {
  High: "#ffb336",
  Medium: "#4d88ff",
  Low: "#b07cff",
};

export function normalizeTagName(name: string): string {
  return name.trim().toLowerCase();
}

export function buildTagColorMap(
  tags: { name: string; color: string }[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const tag of tags) {
    map.set(normalizeTagName(tag.name), tag.color);
  }
  return map;
}

export function getTaskBarColor(
  task: Task,
  tagColorMap: Map<string, string>,
): string {
  for (const tagName of task.tags) {
    const color = tagColorMap.get(normalizeTagName(tagName));
    if (color) return color;
  }
  return COMPLEXITY_HEX[task.complexity];
}

export function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) return "#000000";

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.62 ? "#000000" : "#ffffff";
}
