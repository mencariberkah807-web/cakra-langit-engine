import { motion } from "framer-motion";
import SkyWorkspace from "./SkyWorkspace";
import LiveObservation from "./LiveObservation";

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function EventCard({ title, items = [] }) {
  const solar = title === "Solar Events";

  return (
    <motion.div
      variants={item}
      className={
        solar
          ? "rounded-[18px] border border-[#80641E] bg-[linear-gradient(135deg,rgba(251,191,36,0.13),rgba(6,17,27,0.94)_62%)] p-4 sm:p-5"
          : "rounded-[18px] border border-[#5579A4] bg-[linear-gradient(135deg,rgba(96,165,250,0.13),rgba(7,18,29,0.94)_62%)] p-4 sm:p-5"
      }
    >
      <div
        className={
          solar
            ? "flex items-center gap-2 border-b border-[#4B3B1C] pb-3"
            : "flex items-center gap-2 border-b border-[#29425E] pb-3"
        }
      >
        <h3
          className={
            solar
              ? "text-sm font-bold uppercase tracking-[0.1em] text-[#F8D66D]"
              : "text-sm font-bold uppercase tracking-[0.1em] text-[#BFD7FF]"
          }
        >
          {title}
        </h3>
      </div>

      <div
        className={
          solar
            ? "mt-4 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5"
            : "mt-4 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        }
      >
        {items.map(([label, value]) => (
          <div
            key={label}
            className={
              solar
                ? "min-w-0 sm:border-r sm:border-[#3A3523] sm:pr-2 last:border-r-0"
                : "min-w-0 sm:border-r sm:border-[#2C4158] sm:pr-2 last:border-r-0"
            }
          >
            <p
              className={
                solar
                  ? "text-[9px] font-medium text-[#A89155]"
                  : "text-[9px] font-medium text-[#7895B3]"
              }
            >
              {label}
            </p>
            <p className="mt-1 whitespace-nowrap font-mono text-sm font-semibold leading-tight tabular-nums text-[#EDF9FF] sm:text-base xl:text-lg">
              {String(value ?? "—")}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function NaturalLayer({ data, loading }) {
  const sun = data?.natural?.sun || {};
  const moon = data?.natural?.moon || {};

  return (
    <section className="bg-[#0f172a] px-3 pb-6 pt-2 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#527D95]">
              Natural Layer
            </div>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#D8F3FF]">
              Sky Overview
            </h2>
          </div>
          <div className="hidden text-right text-[9px] uppercase tracking-[0.14em] text-[#4F7184] sm:block">
            Personal Almanac Observation
          </div>
        </div>

        <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
          <SkyWorkspace data={data} loading={loading} />
          <LiveObservation data={data} />
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <EventCard
            title="Solar Events"
            items={[
              ["Dawn", sun.dawn],
              ["Sunrise", sun.sunrise],
              ["Noon", sun.noon],
              ["Sunset", sun.sunset],
              ["Dusk", sun.dusk],
            ]}
          />

          <EventCard
            title="Lunar Events"
            items={[
              ["Transit", moon.transit],
              ["Moonset", moon.set],
              ["Phase", moon.phase],
              ["Illumination", moon.illumination],
            ]}
          />
        </div>
      </div>
    </section>
  );
}
