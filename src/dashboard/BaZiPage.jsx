import { useState } from "react";
import { adaptBaziProfile } from "../adapters/baziProfile.adapter.js";
import { adaptJawaProfile } from "../adapters/jawaProfile.adapter.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const TOKEN_KEY = "cakra-langit:access-token";

function ResultCard({ result }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#22D3EE]">Profile Engine</div>
      <h2 className="mt-1 text-sm font-semibold text-white">{result.title}</h2>
      {result.meta?.status === "UNAVAILABLE" ? (
        <p className="mt-3 text-sm text-[#71869A]">Hasil belum tersedia.</p>
      ) : (
        <>
          <p className="mt-3 text-lg font-semibold text-white">{result.primary || "—"}</p>
          {result.secondary && <p className="mt-1 text-xs text-[#8FA4B8]">{result.secondary}</p>}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {result.details.map((item) => (
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
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");
  const [dayBoundary, setDayBoundary] = useState("MIDNIGHT");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function calculate(event) {
    event.preventDefault();
    setError("");
    setResults(null);
    if (!birthDate) {
      setError("Tanggal lahir wajib diisi.");
      return;
    }
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setError("Silakan masuk terlebih dahulu untuk menghitung profil.");
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
      if (!response.ok) throw new Error(payload?.detail || `Perhitungan gagal (${response.status}).`);
      const context = {
        profile: { birth: payload.profile?.birth || { date: birthDate, time: birthTime } },
        profileData: { bazi: payload.bazi || null, jawa: payload.jawa || null },
      };
      const profileResults = {
        bazi: adaptBaziProfile(context),
        jawa: adaptJawaProfile(context),
      };
      setResults(profileResults);
      window.localStorage.setItem("cakra-langit:profile-blueprint", JSON.stringify({
        birthDate,
        birthTime,
        dayBoundary,
        results: profileResults,
      }));
    } catch (err) {
      setError(err.message || "Gagal memuat hasil profil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">Cakra Langit · Cetak Biru Diri</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Profil BaZi & Weton Jawa</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">Masukkan data kelahiran untuk meminta hasil dari engine yang sudah ada. Halaman ini tidak menghitung ulang rumus BaZi maupun Weton Jawa.</p>
      </header>

      <form onSubmit={calculate} className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
        <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">Data Kelahiran</div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal lahir</span>
            <input required type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Waktu lahir</span>
            <input required type="time" value={birthTime} onChange={(event) => setBirthTime(event.target.value)} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Batas pergantian hari BaZi</span>
            <select value={dayBoundary} onChange={(event) => setDayBoundary(event.target.value)} className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40">
              <option value="MIDNIGHT">Midnight</option>
              <option value="ZI_HOUR_23">Zi Hour (23:00)</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#71869A]">Waktu dimasukkan sesuai catatan kelahiran. Zona waktu dan lokasi kelahiran belum menjadi input endpoint ini; hasil tidak boleh dianggap telah dikoreksi terhadap waktu matahari lokal.</p>
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/20 bg-red-950/20 p-3 text-sm text-red-200">{error}</p>}
        <button type="submit" disabled={loading} className="mt-5 rounded-xl bg-[#174461] px-5 py-3 text-sm font-semibold text-white hover:bg-[#205878] disabled:opacity-60">{loading ? "Menghitung…" : "Hitung Profil"}</button>
      </form>

      {results && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ResultCard result={results.bazi} />
          <ResultCard result={results.jawa} />
        </div>
      )}
    </section>
  );
}
