const PHASE_ANGLE = {
  "New Moon": 0,
  "Waxing Crescent": Math.PI / 4,
  "First Quarter": Math.PI / 2,
  "Waxing Gibbous": (3 * Math.PI) / 4,
  "Full Moon": Math.PI,
  "Waning Gibbous": (5 * Math.PI) / 4,
  "Last Quarter": (3 * Math.PI) / 2,
  "Waning Crescent": (7 * Math.PI) / 4,
};

export default function MoonPhaseCanvas({ phase, illumination }) {
  const angle = PHASE_ANGLE[phase] ?? 0;
  const waxing = angle <= Math.PI;
  const lit = Math.max(0, Math.min(100, Number(illumination) || 0));
  const xTerm = 28 * Math.cos(angle);
  const rx = Math.max(0.01, Math.abs(xTerm));
  const terminatorSweep = waxing ? (xTerm >= 0 ? 1 : 0) : (xTerm <= 0 ? 1 : 0);
  const outerSweep = waxing ? 1 : 0;
  const path = [
    `M 30 2`,
    `A 28 28 0 0 ${outerSweep} 30 58`,
    `A ${rx.toFixed(2)} 28 0 0 ${terminatorSweep} 30 2`,
    "Z",
  ].join(" ");

  return (
    <div className="mt-2 flex h-12 items-center gap-2" aria-label={`${phase}, ${lit}% illuminated`}>
      <svg viewBox="0 0 60 60" className="h-11 w-11 shrink-0" role="img">
        <defs>
          <radialGradient id="moonPhaseSurface" cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="72%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>
        </defs>
        <circle cx="30" cy="30" r="28" fill="#0F172A" />
        {lit > 0 && <path d={path} fill="url(#moonPhaseSurface)" />}
        <circle cx="30" cy="30" r="28" fill="none" stroke="#CBD5E1" strokeWidth="1" opacity="0.65" />
      </svg>
      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">Illumination</p>
        <p className="font-mono text-[11px] font-semibold tabular-nums text-[#475569]">{lit}%</p>
      </div>
    </div>
  );
}
