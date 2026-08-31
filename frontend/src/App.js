import { useEffect, useState } from "react";
import axios from "axios";
import Lenis from "lenis";
import { Toaster, toast } from "sonner";
import Header from "@/components/Header";
import NaturalLayer from "@/components/NaturalLayer";
import CalendarSystems from "@/components/CalendarSystems";
import MonthCalendar from "@/components/MonthCalendar";
import ScheduleTimeline from "@/components/ScheduleTimeline";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function App() {
  const [locations, setLocations] = useState([]);
  const [city, setCity] = useState("bandung");
  const [dateISO, setDateISO] = useState(() => iso(new Date()));
  const [time, setTime] = useState("12:00");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    axios.get(`${API}/locations`).then((r) => setLocations(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/almanac`, { params: { city, date: dateISO } })
      .then((r) => {
        setData(r.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Almanac engine unreachable");
        setLoading(false);
      });
  }, [city, dateISO]);

  const isToday = dateISO === iso(new Date());

  const handleCity = (c) => {
    setCity(c);
    const loc = locations.find((l) => l.id === c);
    if (loc) toast.success(`Recalculated for ${loc.name}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
      <Toaster position="bottom-right" />
      <Header
        data={data}
        locations={locations}
        city={city}
        onCityChange={handleCity}
        isToday={isToday}
        onJumpToday={() => setDateISO(iso(new Date()))}
      />
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <NaturalLayer data={data} loading={loading} />
            <CalendarSystems data={data} loading={loading} />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-4">
            <MonthCalendar
              dateISO={dateISO}
              onSelect={setDateISO}
              time={time}
              onTimeChange={setTime}
              onJumpToday={() => setDateISO(iso(new Date()))}
            />
            <ScheduleTimeline data={data} loading={loading} time={time} />
          </div>
        </div>
      </main>
      <Ticker data={data} />
      <Footer data={data} />
    </div>
  );
}
