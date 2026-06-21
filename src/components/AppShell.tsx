"use client";

import { useState } from "react";
import type { ViewTab } from "@/lib/types";
import { TaskProvider } from "@/context/TaskContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { TabNav } from "@/components/layout/TabNav";
import { LinearCalendar } from "@/components/calendar/LinearCalendar";
import { ZoomedLinearCalendar } from "@/components/calendar/ZoomedLinearCalendar";
import { WeeklyCalendar } from "@/components/calendar/WeeklyCalendar";
import { TaskTable } from "@/components/table/TaskTable";

function AppContent() {
  const [activeTab, setActiveTab] = useState<ViewTab>("linear-year");
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <div className="flex min-h-screen flex-col bg-terminal-bg text-terminal-text">
      <AppHeader
        year={year}
        onPrevYear={() => setYear((y) => y - 1)}
        onNextYear={() => setYear((y) => y + 1)}
        onToday={() => setYear(new Date().getFullYear())}
      />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex flex-1 flex-col overflow-hidden">
        {activeTab === "linear-year" && <LinearCalendar year={year} />}
        {activeTab === "linear-zoom" && <ZoomedLinearCalendar year={year} />}
        {activeTab === "weekly" && <WeeklyCalendar year={year} />}
        {activeTab === "table" && <TaskTable />}
      </main>
    </div>
  );
}

export function AppShell() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}
