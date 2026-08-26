interface BoardingPassCardProps {
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  date: string;
  price: number;
  duration: string;
}

export default function BoardingPassCard({
  fromCity,
  fromCode,
  toCity,
  toCode,
  date,
  price,
  duration,
}: BoardingPassCardProps) {
  return (
    <div className="relative w-full max-w-sm rounded-2xl bg-sand text-ink shadow-2xl">
      {/* Top section: route */}
      <div className="flex items-center justify-between px-6 pb-6 pt-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/50">From</p>
          <p className="font-display text-2xl font-semibold">{fromCode}</p>
          <p className="text-xs text-ink/60">{fromCity}</p>
        </div>

        <div className="flex flex-1 items-center px-3">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="mx-1 flex-1 border-t border-dashed border-ink/30" />
          <span className="text-lg text-coral">✈</span>
          <span className="mx-1 flex-1 border-t border-dashed border-ink/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        </div>

        <div className="text-right">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/50">To</p>
          <p className="font-display text-2xl font-semibold">{toCode}</p>
          <p className="text-xs text-ink/60">{toCity}</p>
        </div>
      </div>

      {/* Perforated divider */}
      <div className="relative flex items-center">
        <span className="absolute -left-3 h-6 w-6 rounded-full bg-[#0E5C56]" />
        <div className="perforation h-px w-full" />
        <span className="absolute -right-3 h-6 w-6 rounded-full bg-[#0E5C56]" />
      </div>

      {/* Bottom section: details */}
      <div className="flex items-center justify-between px-6 pb-6 pt-5 font-mono text-xs">
        <div>
          <p className="uppercase tracking-widest text-ink/50">Departs</p>
          <p className="mt-1 font-medium">{date}</p>
        </div>
        <div>
          <p className="uppercase tracking-widest text-ink/50">Duration</p>
          <p className="mt-1 font-medium">{duration}</p>
        </div>
        <div className="text-right">
          <p className="uppercase tracking-widest text-ink/50">Fare</p>
          <p className="mt-1 font-medium text-coral">${price}</p>
        </div>
      </div>
    </div>
  );
}