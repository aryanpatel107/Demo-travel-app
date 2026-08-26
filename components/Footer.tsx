export default function Footer() {
  return (
    <footer className="border-t border-gold/30 bg-ink text-sand/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 font-mono text-xs sm:flex-row">
        <p>&copy; {new Date().getFullYear()} WANDERLY TRAVEL CO.</p>
        <p className="tracking-widest">FLY · EXPLORE · RETURN</p>
      </div>
    </footer>
  );
}