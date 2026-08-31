import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Mountain } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function LiveClock({ tz }) {
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return <>{now}</>;
}

const labelCls =
  "text-[11px] font-bold uppercase tracking-[0.08em] text-[#475569]";

export default function Header({ data, locations, city, onCityChange, isToday }) {
  const loc = data?.location;
  const di = data?.date_info;

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-12 gap-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div
            data-testid="brand-logo"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC]"
          >
            <Mountain className="h-6 w-6 text-[#0F172A]" strokeWidth={1.5} />
          </div>
          <div>
            <p className={labelCls}>Personal Almanac</p>
            <div className="mt-0.5 flex items-center gap-2.5">
              <span className="block overflow-hidden">
                <motion.span
                  data-testid="page-title"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="block font-display text-[28px] font-bold leading-8 tracking-[-0.02em]"
                >
                  Explore
                </motion.span>
              </span>
              <span
                data-testid="mode-badge"
                className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#475569]"
              >
                {isToday ? "Live" : "Past"}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#475569]">
              <span className="flex items-center gap-1.5" data-testid="header-date-line">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
                {di ? di.date_long : "—"}
              </span>
              <span className="flex items-center gap-1.5" data-testid="header-location-line">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                {loc ? `${loc.name}, ${loc.region}` : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-x-12 gap-y-4">
          <div>
            <p className={labelCls}>Selected Time</p>
            <div className="mt-0.5 flex items-center gap-2">
              <span
                data-testid="live-time-badge"
                className="font-mono text-[28px] font-semibold leading-8 tracking-[-0.02em] tabular-nums"
              >
                <LiveClock tz={loc?.tz || "Asia/Jakarta"} />
              </span>
              <span className="rounded-md bg-[#0F172A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                {loc?.tz_label || "WIB"}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#475569]">
              {loc ? `${loc.tz} (${loc.utc})` : "—"}
            </p>
          </div>
          <div className="w-[210px]">
            <p className={labelCls}>Location</p>
            <Select value={city} onValueChange={onCityChange}>
              <SelectTrigger
                data-testid="location-dropdown-trigger"
                className="mt-1 h-10 border-[#E2E8F0] bg-white text-sm font-medium focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
              >
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem
                    key={l.id}
                    value={l.id}
                    data-testid={`location-option-${l.id}`}
                  >
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-[#475569]">{loc?.region || "—"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
