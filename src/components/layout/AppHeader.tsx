"use client";

interface AppHeaderProps {
  year: number;
  onPrevYear: () => void;
  onNextYear: () => void;
  onToday: () => void;
}

export function AppHeader({
  year,
  onPrevYear,
  onNextYear,
  onToday,
}: AppHeaderProps) {
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

      <div className="flex items-center gap-2">
        <PillButton color="bg-terminal-elevated" badge="4">
          Views
        </PillButton>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-terminal-border bg-terminal-elevated font-mono text-xs text-terminal-text">
          JP
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

function PillButton({
  children,
  color,
  badge,
}: {
  children: React.ReactNode;
  color: string;
  badge: string;
}) {
  return (
    <button
      type="button"
      className={`hidden items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white sm:flex ${color}`}
    >
      {children}
      <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-[9px]">
        {badge}
      </span>
    </button>
  );
}
