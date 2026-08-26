const stats = [
  { value: "120+", label: "Destinations" },
  { value: "48K", label: "Trips Booked" },
  { value: "4.8/5", label: "Traveler Rating" },
  { value: "24/7", label: "Support" },
];

export default function Stats() {
  return (
    <section className="border-y border-cloud bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-3xl font-semibold text-teal">{stat.value}</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-ink/50">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}