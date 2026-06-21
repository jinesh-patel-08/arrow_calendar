"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type AuthMode = "signin" | "signup";

export function LoginPage() {
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Authentication failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-terminal-bg px-6">
        <div className="w-full max-w-lg rounded border border-terminal-border bg-terminal-surface p-8">
          <h1 className="font-mono text-xl font-bold text-terminal-text">
            Firebase Setup Required
          </h1>
          <p className="mt-3 font-mono text-sm leading-relaxed text-terminal-muted">
            Copy <code className="text-accent-orange">.env.local.example</code> to{" "}
            <code className="text-accent-orange">.env.local</code>, add your
            Firebase project keys, then restart the dev server.
          </p>
          <ol className="mt-6 list-decimal space-y-2 pl-5 font-mono text-xs text-terminal-dim">
            <li>Create a project at console.firebase.google.com</li>
            <li>Enable Email/Password under Authentication</li>
            <li>Create a Firestore database</li>
            <li>Add a Web app and copy the config values</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-terminal-bg px-6">
      <div className="w-full max-w-md rounded border border-terminal-border bg-terminal-surface p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-orange">
          Arrow Calendar
        </p>
        <h1 className="mt-2 font-mono text-2xl font-bold text-terminal-text">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>
        <p className="mt-2 font-mono text-xs text-terminal-dim">
          Your tasks are saved securely to your Firebase account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-terminal-muted">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-terminal-text outline-none focus:border-accent-orange"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-terminal-muted">
              Password
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-terminal-text outline-none focus:border-accent-orange"
              placeholder="At least 6 characters"
            />
          </label>

          {error && (
            <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-accent-orange py-2.5 font-mono text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting
              ? "Please wait…"
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-xs text-terminal-dim">
          {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
            className="text-accent-orange hover:underline"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
