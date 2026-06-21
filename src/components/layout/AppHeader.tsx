"use client";

import { useAuth } from "@/context/AuthContext";

interface AppHeaderProps {
  year: number;
  onPrevYear: () => void;
  onNextYear: () => void;
  onToday: () => void;
}

function getInitials(email: string): string {
  const localPart = email.split("@")[0] ?? email;
  const parts = localPart.split(/[._-]/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return localPart.slice(0, 2).toUpperCase();
}

export function AppHeader({
  year,
  onPrevYear,
  onNextYear,
  onToday,
}: AppHeaderProps) {
  const { user, logOut } = useAuth();
  const initials = user?.email ? getInitials(user.email) : "??";

  return (
    <header className="flex items-center justify-between border-b border-terminal-border bg-terminal-bg px-6 py-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-3xl font-bold tracking-tight text-terminal-text">
            {year}
          </span>
          <div className="flex items-center gap-1">
            <HeaderButton onClick={onPrevYear} label="Previous year">
              ‹
            </HeaderButton>
            <HeaderButton onClick={onNextYear} label="Next year">
              ›
            </HeaderButton>
            <HeaderButton onClick={onToday} label="Go to today">
              ☀
            </HeaderButton>
          </div>
        </div>
        <div className="hidden h-6 w-px bg-terminal-border sm:block" />
        <h1 className="hidden font-mono text-sm uppercase tracking-[0.2em] text-terminal-muted sm:block">
          Arrow Calendar
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden max-w-[180px] truncate font-mono text-[10px] text-terminal-dim sm:block">
          {user?.email}
        </span>
        <button
          type="button"
          onClick={() => void logOut()}
          className="rounded border border-terminal-border bg-terminal-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-terminal-muted transition-colors hover:border-terminal-muted hover:text-terminal-text"
        >
          Sign Out
        </button>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full border border-terminal-border bg-terminal-elevated font-mono text-xs text-terminal-text"
          title={user?.email ?? "Signed in"}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}

function HeaderButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded border border-terminal-border bg-terminal-surface font-mono text-lg text-terminal-muted transition-colors hover:border-terminal-muted hover:text-terminal-text"
    >
      {children}
    </button>
  );
}
