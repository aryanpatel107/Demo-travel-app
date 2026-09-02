export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-coral">Our story</p>
      <h1 className="mt-2 mb-6 font-display text-3xl font-semibold text-ink">About Wanderly</h1>
      <p className="leading-relaxed text-ink/80">
        Wanderly is a travel planning platform built for explorers who want more than a
        checklist of tourist spots. We curate destinations based on real experiences,
        connect you with trip-planning tools, and help you turn inspiration into an
        itinerary. Whether you are chasing mountain trails or quiet coastlines, Wanderly
        is here to help you get there.
      </p>
      <p className="mt-4 leading-relaxed text-ink/80">
        This project is a demo Next.js application showcasing modern React patterns,
        TypeScript, and the App Router.
      </p>
    </section>
  );
}