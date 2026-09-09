import {
  Activity,
  Cloud,
  Droplets,
  Magnet,
  Mountain,
  Radiation,
  Wind,
  LockKeyhole,
} from "lucide-react";

const futureEngines = [
  ["atmosphere", Cloud, "Atmosphere"],
  ["weather", Cloud, "Weather"],
  ["geomagnetic", Magnet, "Geomagnetic"],
  ["radiation", Radiation, "Radiation"],
  ["air-quality", Wind, "Air Quality"],
  ["volcanic", Mountain, "Volcanic"],
  ["seismic", Activity, "Seismic"],
  ["ocean", Droplets, "Ocean"],
];

export default function NaturalFutureEngines() {
  return (
    <section className="relative z-10 mt-5 border-t border-[#164263] pt-4" data-testid="natural-future-engines">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#91B1C8]">Nature Layer · Future Engines</h3>
          <p className="mt-1 text-[9px] text-[#587993]">Extended natural environment data</p>
        </div>
        <LockKeyhole className="h-3.5 w-3.5 text-[#5B7890]" strokeWidth={1.8} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {futureEngines.map(([id, Icon, label]) => (
          <div key={id} className="rounded-xl border border-dashed border-[#244765] bg-[#061827]/52 p-3 opacity-85" data-testid={`future-natural-${id}`}>
            <Icon className="h-4 w-4 text-[#66839B]" strokeWidth={1.8} />
            <p className="mt-2 text-[10px] font-semibold text-[#9AB3C6]">{label}</p>
            <p className="mt-1 text-[9px] uppercase tracking-wide text-[#55728A]">Coming soon</p>
          </div>
        ))}
      </div>
    </section>
  );
}
