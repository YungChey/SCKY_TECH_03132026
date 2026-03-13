"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationBarProps = {
  prompt: string;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
};

export function NavigationBar({
  prompt,
  isLoading,
  onPromptChange,
  onSubmit,
}: NavigationBarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-3 z-20 sm:top-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 rounded-[1.75rem] border border-slate-200/80 bg-white/85 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-nowrap sm:gap-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#002855] text-sm font-bold tracking-[0.18em] text-white">
            VA
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-900">
              VerdictAI
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 sm:whitespace-nowrap">
              AI recommendation intelligence
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          <Link
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              pathname === "/"
                ? "bg-[#002855] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-[#F26419] hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/risk"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              pathname === "/risk"
                ? "bg-[#002855] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-[#F26419] hover:text-white"
            }`}
          >
            Risk & Compliance
          </Link>
          <Link
            href="/why"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              pathname === "/why"
                ? "bg-[#002855] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-[#F26419] hover:text-white"
            }`}
          >
            Why VerdictAI?
          </Link>
        </nav>

        <div className="order-3 flex w-full min-w-0 items-center gap-2 rounded-[1.35rem] border border-slate-200 bg-slate-50 px-3 py-2 shadow-inner sm:order-none sm:flex-1 sm:gap-3">
          <svg
            className="h-5 w-5 shrink-0 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Best laptops under $500"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="shrink-0 rounded-full bg-[#F26419] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#002855] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            <span className="sm:hidden">{isLoading ? "Working" : "Go"}</span>
            <span className="hidden sm:inline">
              {isLoading ? "Analyzing" : "Analyze"}
            </span>
          </button>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 shadow-sm">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="8" r="4" />
          </svg>
        </div>
      </div>
    </header>
  );
}
