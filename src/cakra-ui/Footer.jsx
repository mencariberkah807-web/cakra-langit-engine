import { Info, Database } from "lucide-react";

export default function Footer({ data }) {
  const loc = data?.location;
  return (
    <footer
      data-testid="footer-status-bar"
      className="border-t border-[#E2E8F0] bg-white"
    >
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-10 gap-y-2 px-4 py-3.5 text-xs text-[#475569] sm:px-6 lg:px-8">
        <span className="flex items-center gap-2" data-testid="footer-data-note">
          <Info className="h-3.5 w-3.5" strokeWidth={1.8} />
          {loc
            ? `Data calculated for ${loc.name} (${loc.tz}, ${loc.utc})`
            : "Data calculated for —"}
        </span>
        <span className="hidden md:inline">All times are local time</span>
        <span className="ml-auto flex items-center gap-2">
          <Database className="h-3.5 w-3.5" strokeWidth={1.8} />
          Engine: v1.0.0
        </span>
        <span className="flex items-center gap-2 font-medium text-[#0F172A]" data-testid="footer-status-ok">
          <span className="pulse-dot h-2 w-2 rounded-full bg-[#16A34A]" />
          All systems operational
        </span>
      </div>
    </footer>
  );
}
