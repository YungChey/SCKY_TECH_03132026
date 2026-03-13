"use client";

type PromptInputCardProps = {
  prompt: string;
  isLoading: boolean;
  error: string | null;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
};

export function PromptInputCard({
  prompt,
  isLoading,
  error,
  onPromptChange,
  onSubmit,
}: PromptInputCardProps) {
  return (
    <section className="rounded-[2rem] border border-amber-950/10 bg-white/80 p-6 shadow-[0_24px_70px_rgba(92,63,24,0.12)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-900/70">
            Opening Statement
          </p>
          <h2 className="mt-2 font-display text-3xl text-stone-900">
            Put an AI recommendation on trial
          </h2>
        </div>

        <label className="text-sm font-medium text-stone-700" htmlFor="prompt">
          Prompt
        </label>
        <div className="rounded-[1.75rem] border border-amber-900/10 bg-stone-950/5 p-3 shadow-inner">
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            className="w-full rounded-[1.2rem] border border-transparent bg-white px-5 py-4 text-base text-stone-900 outline-none placeholder:text-stone-400 focus:border-amber-700/40"
            placeholder="Best laptops under $500"
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-amber-50 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Cross-examining..." : "Start Trial"}
          </button>
          <p className="text-sm text-stone-600">
            VerdictAI will extract product claims, challenge weak assertions,
            and compute a trust score.
          </p>
        </div>

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
