import { useMemo } from 'react'
import { useTodayContext } from '../core/TodayContext'

const PASARAN_NAKTU = {
  Kliwon: 8,
  Kaliwon: 8,
  Legi: 5,
  Manis: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
}

const GAGALANG_MANIS_PAHING = [
  { range: 'Kaliwon → Manis', direction: 'Timur' },
  { range: 'Manis → Pahing', direction: 'Selatan' },
  { range: 'Pahing → Pon', direction: 'Barat' },
  { range: 'Pon → Wage', direction: 'Utara' },
  { range: 'Wage → Keliwon', direction: 'Tengah-tengah' },
]

const WATEK_PATOKAN = [
  ['Muharram', 'Jum’at', 'Wani'],
  ['Sapar', 'Jum’at', 'Karang Piwulang'],
  ['Rabiulawal', 'Sabtu', 'Sumur Pinungkeb'],
  ['Rabiulakhir', 'Sabtu', 'Karang Tinangtang'],
  ['Jumadilawal', 'Minggu', 'Macan Katawang'],
  ['Jumadilakhir', 'Minggu', 'Nuju Pati'],
  ['Rajab', 'Senin', 'Nuju Padu'],
  ['Rewah', 'Selasa', 'Mantri Sinareja'],
  ['Puasa', 'Rabu', 'Demang Kanduruan'],
  ['Sawal', 'Rabu', 'Putri Tinuting'],
  ['Dulkaidah', 'Kamis', 'Demang Palasah'],
  ['Rayagung', 'Kamis', 'Alas Kobar'],
]

function Metric({ label, value, note }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#07111C] p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5E7A8F]">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value ?? '—'}</div>
      {note ? <div className="mt-1 text-[11px] text-[#71869A]">{note}</div> : null}
    </div>
  )
}

function Panel({ eyebrow, title, children }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">{eyebrow}</div>
      <h2 className="mt-1 text-sm font-semibold text-white">{title}</h2>
      {children}
    </section>
  )
}

export default function PalintanganPage() {
  const { apiData, selectedDate, setSelectedDate } = useTodayContext()

  const jawa = useMemo(
    () => apiData?.calendars?.find((item) => item.id === 'jawa') || null,
    [apiData]
  )

  const detail = jawa?.detail || {}
  const dayNaktu = detail.dino?.neptu
  const pasaranName = detail.pasaran?.name
  const pasaranNaktu = PASARAN_NAKTU[pasaranName]

  const wedal =
    Number.isFinite(Number(dayNaktu)) && Number.isFinite(Number(pasaranNaktu))
      ? Number(dayNaktu) + Number(pasaranNaktu)
      : null

  const isoDate =
    apiData?.date_info?.iso ||
    selectedDate?.toISOString().slice(0, 10) ||
    ''

  const dayName = detail.dino?.name || apiData?.date_info?.day_name || '—'

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-7 sm:px-7 lg:py-9">
      <header className="mb-7">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22D3EE]">
          Cakra Langit · Sunda
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Palintangan Sunda
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8FA4B8]">
          Perhitungan Palintangan Sunda mengikuti kerangka Paririmbon Sunda:
          hari, pasaran, naktu, Gagalang Poe, dan Gagalang Manis Pahing.
          Palintangan bukan Weton.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Panel eyebrow="Input" title="Tanggal Perhitungan">
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-semibold text-[#A9BDCF]">Tanggal</span>
            <input
              type="date"
              value={isoDate}
              onChange={(event) => {
                if (event.target.value) {
                  setSelectedDate(new Date(event.target.value + 'T12:00:00'))
                }
              }}
              className="w-full rounded-xl border border-white/[0.09] bg-[#07111C] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
            />
          </label>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#07111C] p-4">
            <div className="text-[10px] uppercase tracking-[0.12em] text-[#536A7D]">SSOT Date</div>
            <div className="mt-1 text-sm font-semibold text-[#C8DCEA]">{isoDate || '—'}</div>
          </div>
        </Panel>

        <Panel eyebrow="Calendar Data" title="Hari, Pasaran, dan Naktu Sunda">
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Hari" value={dayName} />
            <Metric label="Pasaran" value={pasaranName} />
            <Metric label="Naktu Hari" value={dayNaktu} />
            <Metric label="Naktu Pasaran" value={pasaranNaktu} note="nilai Paririmbon" />
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-[#12324A] p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6EB9D2]">
              Naktu Wedal
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-[#07111C] px-4 py-3 text-sm text-[#A9BDCF]">{dayNaktu ?? '—'}</span>
              <span className="text-[#536A7D]">+</span>
              <span className="rounded-lg bg-[#07111C] px-4 py-3 text-sm text-[#A9BDCF]">{pasaranNaktu ?? '—'}</span>
              <span className="text-[#536A7D]">=</span>
              <span className="rounded-lg bg-[#07111C] px-5 py-3 text-xl font-semibold text-white">{wedal ?? '—'}</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#7896A8]">
              Naktu Wedal = Naktu Hari + Naktu Pasaran.
            </p>
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel eyebrow="Gagalang" title="Gagalang Manis Pahing">
          <p className="mt-3 text-xs leading-5 text-[#7896A8]">
            Paririmbon menjelaskan lima posisi tempat keberuntungan dalam putaran
            arah mata angin ditambah tengah-tengah (madhab papat kalima pancer).
          </p>

          <div className="mt-4 space-y-2">
            {GAGALANG_MANIS_PAHING.map((item) => (
              <div
                key={item.range}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#07111C] px-4 py-3"
              >
                <span className="text-xs text-[#A9BDCF]">{item.range}</span>
                <span className="text-xs font-semibold text-white">{item.direction}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Gagalang Poe" title="12 Watek Patokan Paririmbon">
          <p className="mt-3 text-xs leading-5 text-[#7896A8]">
            Sumber menetapkan 12 patokan Watek secara berurutan terhadap 12 bulan.
            Ini adalah data Watek Patokan, bukan Weton atau Wuku.
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.06]">
            <div className="grid grid-cols-[42px_1fr_82px] border-b border-white/[0.06] bg-[#07111C] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#536A7D]">
              <span>#</span>
              <span>Bulan · Watek</span>
              <span>Hari</span>
            </div>
            {WATEK_PATOKAN.map(([month, day, watek], index) => (
              <div
                key={watek}
                className="grid grid-cols-[42px_1fr_82px] items-center border-b border-white/[0.04] px-3 py-2.5 last:border-0"
              >
                <span className="text-xs text-[#536A7D]">{index + 1}</span>
                <div>
                  <div className="text-xs font-semibold text-white">{watek}</div>
                  <div className="text-[10px] text-[#71869A]">{month}</div>
                </div>
                <span className="text-[11px] text-[#A9BDCF]">{day}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0A1723] p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#536A7D]">
          Source Boundary
        </div>
        <h2 className="mt-1 text-sm font-semibold text-white">
          Rule yang belum boleh ditebak
        </h2>
        <p className="mt-3 max-w-4xl text-xs leading-6 text-[#7896A8]">
          Paririmbon menyebut Gagalang Poe memiliki 12 patokan Watek dan
          menjelaskan perhitungan Gagalang berdasarkan hari/pasaran. Formula
          intraday Watek Jam yang lengkap belum terverifikasi, sehingga halaman
          ini tidak mengimpor formula Jawa/Bali atau membuat rumus baru.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-cyan-300/15 bg-cyan-300/5 px-3 py-1 text-[10px] font-semibold text-cyan-200">
            SSOT: PARIRIMBON SUNDA
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[10px] font-semibold text-[#7896A8]">
            pp. 70–73
          </span>
        </div>
      </div>
    </section>
  )
}
