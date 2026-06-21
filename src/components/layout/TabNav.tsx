"use client";

import type { ViewTab } from "@/lib/types";
import { VIEW_TABS } from "@/lib/constants";

interface TabNavProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="flex items-stretch gap-1 border-b border-terminal-border bg-terminal-surface px-4">
      {VIEW_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`group relative flex flex-col items-start px-4 py-3 transition-colors ${
              isActive
                ? "bg-accent-orange text-black"
                : "text-terminal-muted hover:bg-terminal-elevated hover:text-terminal-text"
            }`}
          >
            <span className="font-mono text-xs font-semibold uppercase tracking-widest">
              {tab.label}
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-wider ${
                isActive ? "text-black/70" : "text-terminal-dim"
              }`}
            >
              {tab.subtitle}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
