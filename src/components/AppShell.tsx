"use client";

import { useState } from "react";
import type { ViewTab } from "@/lib/types";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TagProvider, useTagsManager } from "@/context/TagContext";
import { TaskProvider, useTasks } from "@/context/TaskContext";
import { LoginPage } from "@/components/auth/LoginPage";
import { AppHeader } from "@/components/layout/AppHeader";
import { TabNav } from "@/components/layout/TabNav";
import { LinearCalendar } from "@/components/calendar/LinearCalendar";
import { ZoomedLinearCalendar } from "@/components/calendar/ZoomedLinearCalendar";
import { WeeklyCalendar } from "@/components/calendar/WeeklyCalendar";
import { TaskTable } from "@/components/table/TaskTable";
import { TagManager } from "@/components/tags/TagManager";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { loading: tasksLoading, error: tasksError } = useTasks();
  const { loading: tagsLoading, error: tagsError } = useTagsManager();
  const [activeTab, setActiveTab] = useState<ViewTab>("linear-year");
  const [year, setYear] = useState(new Date().getFullYear());

  if (authLoading) {
    return <LoadingScreen message="Checking session…" />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-terminal-bg text-terminal-text">
      <AppHeader
        year={year}
        onPrevYear={() => setYear((y) => y - 1)}
        onNextYear={() => setYear((y) => y + 1)}
        onToday={() => setYear(new Date().getFullYear())}
      />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {tasksError && (
        <div className="border-b border-red-500/40 bg-red-500/10 px-6 py-2 font-mono text-xs text-red-300">
          Tasks error: {tasksError}
        </div>
      )}

      {tagsError && activeTab === "tags" && (
        <div className="border-b border-red-500/40 bg-red-500/10 px-6 py-2 font-mono text-xs text-red-300">
          Tags error: {tagsError} — update Firestore Rules in Firebase Console (see
          instructions below).
        </div>
      )}

      <main className="relative flex flex-1 flex-col overflow-hidden">
        {tasksLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-terminal-bg/80">
            <LoadingScreen message="Loading tasks…" />
          </div>
        )}

        {activeTab === "linear-year" && <LinearCalendar year={year} />}
        {activeTab === "linear-zoom" && <ZoomedLinearCalendar year={year} />}
        {activeTab === "weekly" && <WeeklyCalendar year={year} />}
        {activeTab === "table" && <TaskTable />}
        {activeTab === "tags" && (
          <>
            {tagsLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-terminal-bg/80">
                <LoadingScreen message="Loading tags…" />
              </div>
            )}
            <TagManager tagsError={tagsError} />
          </>
        )}
      </main>
    </div>
  );
}

export function AppShell() {
  return (
    <AuthProvider>
      <TagProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </TagProvider>
    </AuthProvider>
  );
}
