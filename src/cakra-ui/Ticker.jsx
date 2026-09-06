import { CircleDot } from "lucide-react";

export default function Ticker({ data }) {
  const items = data?.ticker || [];
  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <div
      data-testid="almanac-ticker"
      className="overflow-hidden border-y border-[#E2E8F0] bg-white py-2.5"
    >
      <div className="animate-marquee flex w-max items-center gap-6">
        {doubled.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-6 whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#475569]"
          >
            {t}
            <CircleDot className="h-2.5 w-2.5 text-[#CBD5E1]" />
          </span>
        ))}
      </div>
    </div>
  );
}
