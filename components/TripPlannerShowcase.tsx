import { config } from "@/config";

export default function TripPlannerShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-xl md:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">Planner</p>
        <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold text-white">
          {config.sectionTitles.tripPlanner}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">Step 1</p>
            <h3 className="mt-3 text-xl font-semibold">Pick a vibe</h3>
          </div>
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">Step 2</p>
            <h3 className="mt-3 text-xl font-semibold">Choose dates</h3>
          </div>
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">Step 3</p>
            <h3 className="mt-3 text-xl font-semibold">Book with confidence</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
