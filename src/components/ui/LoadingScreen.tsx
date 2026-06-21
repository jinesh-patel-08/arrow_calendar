export function LoadingScreen({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-terminal-bg">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-terminal-muted">
        {message}
      </p>
    </div>
  );
}
