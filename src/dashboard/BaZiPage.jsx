import { useState } from "react";
import { adaptBaziProfile } from "../adapters/baziProfile.adapter.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const TOKEN_KEY = "cakra-langit:access-token";

const STEMS = {
  "甲": { pinyin: "Jia", element: "Wood", polarity: "Yang" },
  "乙": { pinyin: "Yi", element: "Wood", polarity: "Yin" },
  "丙": { pinyin: "Bing", element: "Fire", polarity: "Yang" },
  "丁": { pinyin: "Ding", element: "Fire", polarity: "Yin" },
  "戊": { pinyin: "Wu", element: "Earth", polarity: "Yang" },
  "己": { pinyin: "Ji", element: "Earth", polarity: "Yin" },
  "庚": { pinyin: "Geng", element: "Metal", polarity: "Yang" },
  "辛": { pinyin: "Xin", element: "Metal", polarity: "Yin" },
  "壬": { pinyin: "Ren", element: "Water", polarity: "Yang" },
  "癸": { pinyin: "Gui", element: "Water", polarity: "Yin" },
};

const BRANCHES = {
  "子": { pinyin: "Zi", animal: "Rat", element: "Water" },
  "丑": { pinyin: "Chou", animal: "Ox", element: "Earth" },
  "寅": { pinyin: "Yin", animal: "Tiger", element: "Wood" },
  "卯": { pinyin: "Mao", animal: "Rabbit", element: "Wood" },
  "辰": { pinyin: "Chen", animal: "Dragon", element: "Earth" },
  "巳": { pinyin: "Si", animal: "Snake", element: "Fire" },
  "午": { pinyin: "Wu", animal: "Horse", element: "Fire" },
  "未": { pinyin: "Wei", animal: "Goat", element: "Earth" },
  "申": { pinyin: "Shen", animal: "Monkey", element: "Metal" },
  "酉": { pinyin: "You", animal: "Rooster", element: "Metal" },
  "戌": { pinyin: "Xu", animal: "Dog", element: "Earth" },
  "亥": { pinyin: "Hai", animal: "Pig", element: "Water" },
};

const PILLAR_NAMES = {
  id: { year: "Pilar Tahun", month: "Pilar Bulan", day: "Pilar Hari", hour: "Pilar Jam", stem: "Batang Langit", branch: "Cabang Bumi", element: { Wood: "Kayu", Fire: "Api", Earth: "Tanah", Metal: "Logam", Water: "Air" }, polarity: { Yin: "Yin", Yang: "Yang" }, animal: { Rat: "Tikus", Ox: "Kerbau", Tiger: "Harimau", Rabbit: "Kelinci", Dragon: "Naga", Snake: "Ular", Horse: "Kuda", Goat: "Kambing", Monkey: "Monyet", Rooster: "Ayam", Dog: "Anjing", Pig: "Babi" }, pinyin: "Pinyin" },
  en: { year: "Year Pillar", month: "Month Pillar", day: "Day Pillar", hour: "Hour Pillar", stem: "Heavenly Stem", branch: "Earthly Branch", element: { Wood: "Wood", Fire: "Fire", Earth: "Earth", Metal: "Metal", Water: "Water" }, polarity: { Yin: "Yin", Yang: "Yang" }, animal: { Rat: "Rat", Ox: "Ox", Tiger: "Tiger", Rabbit: "Rabbit", Dragon: "Dragon", Snake: "Snake", Horse: "Horse", Goat: "Goat", Monkey: "Monkey", Rooster: "Rooster", Dog: "Dog", Pig: "Pig" }, pinyin: "Pinyin" },
};

function describePillar(ganzhi, language) {
  if (!ganzhi || [...ganzhi].length < 2) return null;
  const chars = [...ganzhi];
  const stem = STEMS[chars[0]];
  const branch = BRANCHES[chars[1]];
  if (!stem || !branch) return null;
  const labels = PILLAR_NAMES[language];
  return {
    characters: chars.slice(0, 2).join(""),
    pinyin: `${stem.pinyin} ${branch.pinyin}`,
    stem: `${labels.polarity[stem.polarity]} ${labels.element[stem.element]}`,
    branch: `${labels.animal[branch.animal]} · ${labels.element[branch.element]}`,
    stemLabel: labels.stem,
    branchLabel: labels.branch,
  };
}

const COPY = {
  id: {
    eyebrow: "CAKRA LANGIT · CETAK BIRU DIRI",
    title: "Profil BaZi",
    intro: "Masukkan data kelahiran untuk melihat Four Pillars dari engine BaZi yang tersedia. Halaman ini hanya menampilkan BaZi; Weton Jawa tersedia di halaman Weton.",
    form: "DATA KELAHIRAN",
    date: "Tanggal lahir",
    time: "Waktu lahir",
    boundary: "Batas pergantian hari BaZi",
    midnight: "Tengah malam",
    zi: "Jam Zi (23.00)",
    note: "Waktu mengikuti catatan kelahiran. Lokasi dan zona waktu belum menjadi input, sehingga hasil belum dikoreksi terhadap waktu matahari lokal.",
    submit: "Hitung BaZi",
    loading: "Menghitung…",
    card: "HASIL BAZI",
    unavailable: "Hasil belum tersedia.",
    noToken: "Sesi login tidak tersedia. Silakan keluar lalu masuk kembali.",
    expired: "Sesi login kedaluwarsa atau tidak valid. Silakan keluar lalu masuk kembali.",
    required: "Tanggal lahir wajib diisi.",
    failed: "Perhitungan BaZi gagal.",
    characters: "Delapan Karakter",
    pillars: "Empat Pilar",
    original: "Notasi asli engine",
    translated: "Pembacaan dalam Bahasa Indonesia",
    year: "Pilar Tahun", month: "Pilar Bulan", day: "Pilar Hari", hour: "Pilar Jam", stem: "Batang Langit", branch: "Cabang Bumi",
  },
  en: {
    eyebrow: "CAKRA LANGIT · PERSONAL BLUEPRINT",
    title: "BaZi Profile",
    intro: "Enter birth details to view the Four Pillars from the existing BaZi engine. This page displays BaZi only; Javanese Weton belongs on the Weton page.",
    form: "BIRTH DETAILS",
    date: "Birth date",
    time: "Birth time",
    boundary: "BaZi day-boundary convention",
    midnight: "Midnight",
    zi: "Zi hour (11:00 PM)",
    note: "Time follows the recorded birth time. Birth location and time zone are not inputs yet, so the result is not adjusted to local solar time.",
    submit: "Calculate BaZi",
    loading: "Calculating…",
    card: "BAZI RESULT",
    unavailable: "Result is not available.",
    noToken: "No active login session. Please log out and sign in again.",
    expired: "Your login session is invalid or expired. Please log out and sign in again.",
    required: "Birth date is required.",
    failed: "BaZi calculation failed.",
    characters: "Eight Characters",
    pillars: "Four Pillars",
    original: "Original engine notation",
    translated: "English reading",
    year: "Year Pillar", month: "Month Pillar", day: "Day Pillar", hour: "Hour Pillar", stem: "Heavenly Stem", branch: "Earthly Branch",
  },
};

function ResultCard({ result, copy, language }) {
  const rawPillars = result.detail?.pillars || {};
  const pillarItems = [
    { key: "year", label: copy.year, value: rawPillars.year?.selected || rawPillars.year?.ganzhi },
    { key: "month", label: copy.month, value: rawPillars.month?.selected || rawPillars.month?.ganzhi },
    { key: "day", label: copy.day, value: rawPillars.day?.selected || rawPillars.day?.ganzhi },
    { key: "hour", label: copy.hour, value: rawPillars.hour?.selected || rawPillars.hour?.ganzhi },
  ].map((item) => ({ ...item, description: describePillar(item.value, language) }))
    .filter((item) => item.description);
  const details = [
    { label: copy.characters, value: result.details?.find((item) => item.label === "Eight Characters")?.value || result.primary },
    { label: copy.pillars, value: result.details?.find((item) => item.label === "Pillars")?.value || result.secondary },
  ];
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#22D3EE]">{copy.card}</div>
      <h2 className="mt-1 text-sm font-semibold text-white">BaZi · 八字</h2>
      {result.meta?.status === "UNAVAILABLE" ? (
        <p className="mt-3 text-sm text-[#71869A]">{copy.unavailable}</p>
      ) : (
        <>
          <p className="mt-3 text-xl font-semibold text-white">{result.primary || "—"}</p>
          <p className="mt-1 text-xs text-[#8FA4B8]">{copy.original}: {result.secondary || "—"}</p>
          <h3 className="mt-5 text-sm font-semibold text-white">{copy.translated}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {pillarItems.map((item) => (
              <div key={item.key} className="rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
                <div className="text-[10px] uppercase tracking-[0.1em] text-[#536A7D]">{item.label}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-white">{item.description.characters}</span>
                  <span className="text-sm text-[#A9BDCF]">{item.description.pinyin}</span>
                </div>
                <div className="mt-3 text-xs text-[#8FA4B8]">{item.description.stemLabel}: <span className="text-[#D3E1EC]">{item.description.stem}</span></div>
                <div className="mt-1 text-xs text-[#8FA4B8]">{item.description.branchLabel}: <span className="text-[#D3E1EC]">{item.description.branch}</span></div>
              </div>
            ))}
          </div>
          <h3 className="mt-5 text-sm font-semibold text-white">{copy.original}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label} className="rounded-lg border border-white/[0.06] bg-[#07111C] p-3">
                <div className="text-[10px] uppercase tracking-[0.1em] text-[#536A7D]">{item.label}</div>
                <div className="mt-1 break-words text-sm text-[#A9BDCF]">{item.value || "—"}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default function BaZiPage() {
  const [language, setLanguage] = useState("id");
  const copy = COPY[language];
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");
  const [dayBoundary, setDayBoundary] = useState("MIDNIGHT");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function calculate(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    if (!birthDate) {
      setError(copy.required);
      return;
    }
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setError(copy.noToken);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        birth_date: birthDate,
        birth_time: birthTime.length === 5 ? birthTime + ":00" : birthTime,
        day_boundary: dayBoundary,
      });
      const response = await fetch(`${API_BASE}/api/profile/blueprint?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => null);
      if (response.status === 401) throw new Error(copy.expired);
      if (!response.ok) throw new Error(payload?.detail || copy.failed);
      const context = {
        profile: { birth: payload.profile?.birth || { date: birthDate, time: birthTime } },
        profileData: { bazi: payload.bazi || null },
      };
      const baziResult = adaptBaziProfile(context);
      setResult(baziResult);
      window.localStorage.setItem("cakra-langit:profile-blueprint", JSON.stringify({
        birthDate,
        birthTime,
        dayBoundary,
        results: { bazi: baziResult },
      }));
    } catch (err) {
      setError(err.message || copy.failed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">{copy.eyebrow}</div>
          <div className="flex rounded-lg border border-white/[0.08] p-1" aria-label="Language">
            <button type="button" onClick={() => setLanguage("id")} aria-pressed={language === "id"} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${language === "id" ? "bg-[#174461] text-white" : "text-[#8FA4B8]"}`}>Indonesia</button>
            <button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${language === "en" ? "bg-[#174461] text-white" : "text-[#8FA4B8]"}`}>English</button>
          </div>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{copy.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">{copy.intro}</p>
      </header>

      <form onSubmit={calculate} className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
        <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">{copy.form}</div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">{copy.date}</span>
            <input required type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">{copy.time}</span>
            <input required type="time" value={birthTime} onChange={(event) => setBirthTime(event.target.value)} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">{copy.boundary}</span>
            <select value={dayBoundary} onChange={(event) => setDayBoundary(event.target.value)} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40">
              <option value="MIDNIGHT">{copy.midnight}</option>
              <option value="ZI_HOUR_23">{copy.zi}</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#71869A]">{copy.note}</p>
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/20 bg-red-950/20 p-3 text-sm text-red-200">{error}</p>}
        <button type="submit" disabled={loading} className="mt-5 rounded-xl bg-[#174461] px-5 py-3 text-sm font-semibold text-white hover:bg-[#205878] disabled:opacity-60">{loading ? copy.loading : copy.submit}</button>
      </form>

      {result && <div className="mt-5"><ResultCard result={result} copy={copy} language={language} /></div>}
    </section>
  );
}
