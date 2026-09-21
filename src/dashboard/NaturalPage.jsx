import { Clock3, Waves, Sun, Moon, CloudSun, Orbit, Eye } from "lucide-react";
import { useTodayContext } from "../core/TodayContext";
import NaturalLayer from "../cakra-ui/NaturalLayer";
import NaturalFutureEngines from "../cakra-ui/NaturalFutureEngines";
import Header from "../cakra-ui/Header";
import { buildDashboardData } from "./dashboardData.js";

function isoLocal(date, timezone) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone || "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function DetailCard({ icon: Icon, title, primary, secondary, rows = [], tone = "blue" }) {
  return (
    <article className={`rounded-[18px] border p-5 shadow-[0_12px_38px_rgba(0,0,0,.18)] ${tone === "gold" ? "border-[#80641E] bg-[linear-gradient(145deg,rgba(82,61,15,.24),rgba(8,24,39,.96))]" : tone === "green" ? "border-[#27685E] bg-[linear-gradient(145deg,rgba(10,72,64,.22),rgba(8,24,39,.96))]" : tone === "violet" ? "border-[#554B86] bg-[linear-gradient(145deg,rgba(63,50,112,.22),rgba(8,24,39,.96))]" : "border-[#275775] bg-[linear-gradient(145deg,rgba(10,48,69,.28),rgba(8,24,39,.96))]"}`}>
      <div className="flex items-center gap-2 border-b border-[#24465C] pb-3">
        <Icon className={`h-5 w-5 ${tone === "gold" ? "text-[#F4C84A]" : tone === "green" ? "text-[#4FD1B5]" : tone === "violet" ? "text-[#B8A8FF]" : "text-[#58C7E8]"}`} strokeWidth={1.8} />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#B8D5E5]">{title}</h3>
      </div>
      <p className="mt-4 text-xl font-semibold leading-tight text-[#F0FAFF]">{primary || "—"}</p>
      {secondary ? <p className="mt-1.5 text-xs text-[#7FA1B8]">{secondary}</p> : null}
      {rows.length ? (
        <div className="mt-4 grid gap-2.5 border-t border-[#24465C] pt-4">
          {rows.map(([label, value]) => (
            <div key={label} className="flex min-w-0 justify-between gap-4 text-[11px]">
              <span className="text-[#66899E]">{label}</span>
              <span className="text-right font-mono font-medium text-[#B4CEDB]">{String(value ?? "—")}</span>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function NaturalPage({ user }) {
  const context = useTodayContext();
  const data = buildDashboardData(context, "id");
  const natural = data.natural || {};
  const location = data.location || context.location || {};
  const timezone = location.timezone || context.location?.timezone || "Asia/Jakarta";
  const date = context.selectedDate || new Date();
  const dateISO = isoLocal(date, timezone);
  const sun = natural.sun || {};
  const moon = natural.moon || {};
  const sky = natural.sky || {};
  const earth = natural.earth || {};
  const eclipse = natural.eclipse || {};
  const tide = natural.tide || {};
  const ocean = tide.ocean || {};
  const schedule = Array.isArray(data.schedule) ? data.schedule : [];

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[#07111C] text-white">
      <Header
        data={data}
        locations={(context.locations || []).map((item) => ({
          ...item,
          name: item.name || item.city,
          region: item.region || item.province,
        }))}
        city={context.selectedLocation?.id || ""}
        onCityChange={context.setLocationById}
        isToday={context.mode === "live"}
        user={user}
      />
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <NaturalLayer data={data} loading={!context.apiData} expanded />

          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#62A5C7]">Natural data</p>
                <h2 className="mt-1 text-xl font-semibold text-[#E4F7FF]">Complete observation details</h2>
              </div>
              <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#66899E] sm:flex">
                <Clock3 className="h-3.5 w-3.5" />
                {timezone}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <DetailCard tone="gold" icon={Sun} title="Sun" primary={sun.status || (String(sun.altitude ?? "—") + "° altitude")} secondary={"Azimuth " + (sun.azimuth ?? "—") + "°"} rows={[["Dawn", sun.dawn], ["Sunrise", sun.sunrise], ["Noon", sun.noon], ["Sunset", sun.sunset], ["Dusk", sun.dusk], ["Golden hour", sun.golden_hour]]} />
              <DetailCard tone="blue" icon={Moon} title="Moon" primary={moon.phase} secondary={(moon.illumination ?? "—") + "% illumination"} rows={[["Age", moon.age], ["Azimuth", moon.azimuth], ["Altitude", moon.altitude], ["Moonrise", moon.rise], ["Moonset", moon.set], ["Next full moon", moon.next_full_moon]]} />
              <DetailCard tone="blue" icon={CloudSun} title="Sky" primary={sky.context} secondary={sky.bortle} rows={Object.entries(sky).filter(([key]) => !["context", "bortle", "primary", "secondary", "title"].includes(key)).slice(0, 6)} />
              <DetailCard tone="green" icon={Orbit} title="Earth Space" primary={earth.primary || earth.context || "Natural context"} secondary={earth.secondary} rows={Object.entries(earth).filter(([key]) => !["primary", "secondary", "title"].includes(key)).slice(0, 6)} />
              <DetailCard tone="blue" icon={Waves} title="Tide · Ocean" primary={tide.available === false ? "Tide model unavailable" : tide.status || tide.location || "—"} secondary={tide.reason || (ocean.available === false ? "No marine data" : ocean.secondary)} rows={[["High tide", Array.isArray(tide.high) && tide.high.length ? tide.high.join(", ") : "—"], ["Low tide", Array.isArray(tide.low) && tide.low.length ? tide.low.join(", ") : "—"], ["Marine", ocean.available === false ? "No marine data" : ocean.primary], ["Marine source", ocean.source]]} />
              <DetailCard tone="violet" icon={Eye} title="Eclipse" primary={eclipse.today?.name || "No eclipse today"} secondary={eclipse.today?.type || eclipse.next?.name || "No active eclipse event"} rows={[["Visibility", eclipse.today?.visibilityRegion], ["Next", eclipse.next?.date || eclipse.next?.name]]} />
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#527D95]">Natural timeline</p>
              <h2 className="mt-1 text-lg font-semibold text-[#D8F3FF]">Events for the selected date</h2>
            </div>
            <div className="rounded-[18px] border border-[#213D52] bg-[#081827]/90 p-4">
              {schedule.length ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {schedule.map((event, index) => (
                    <div key={(event.time || "event") + "-" + index} className="flex items-start gap-3 rounded-xl border border-[#18364A] bg-[#0A1B29] px-3 py-3">
                      <span className="font-mono text-[10px] font-semibold text-[#8FB7CC]">{event.time || "—"}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-[#D8EDF7]">{event.title || "Event"}</p>
                        <p className="mt-1 text-[8px] uppercase tracking-[0.1em] text-[#527D95]">{event.sub || event.cat || "Natural"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-[#587993]">No natural events available for this date.</p>}
            </div>
          </section>

          <NaturalFutureEngines data={data} dateISO={dateISO} expanded />
        </div>
      </section>
    </main>
  );
}
