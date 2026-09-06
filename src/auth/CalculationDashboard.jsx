import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, CloudSun, Droplets, Eye, Leaf, Moon, Plus, Sparkles, Sun, Sunrise, Sunset } from 'lucide-react'

const agenda = [
  { time: '07:00', title: 'Meditasi & doa', note: 'Waktu terbaik untuk menyelaraskan niat', icon: Leaf },
  { time: '10:00', title: 'Pelajari Almanac', note: 'Memahami energi hari ini', icon: Moon },
  { time: '13:00', title: 'Upload konten', note: 'Dokumentasi dan catatan', icon: Sparkles },
  { time: '16:00', title: 'Olahraga ringan', note: 'Menjaga keseimbangan energi', icon: Sun },
  { time: '20:00', title: 'Evaluasi harian', note: 'Refleksi dan jurnal', icon: Leaf },
]

const natural = [
  { title: 'Matahari', value: 'Terbit 05:50', secondary: 'Terbenam 17:51', icon: Sunrise, tone: 'text-amber-500' },
  { title: 'Bulan', value: 'Waning Crescent', secondary: 'Usia 24.16 hari · Iluminasi 29%', icon: Moon, tone: 'text-blue-600' },
  { title: 'Gerhana', value: 'Tidak ada', secondary: 'Tidak ada gerhana hari ini', icon: Eye, tone: 'text-violet-500' },
  { title: 'Langit', value: 'Cerah', secondary: 'Visibilitas baik', icon: CloudSun, tone: 'text-blue-500' },
  { title: 'Elemen', value: 'Hari 249', secondary: '68.2% dari 365 hari', icon: Leaf, tone: 'text-emerald-500' },
]

function CalendarCard() {
  const [cursor, setCursor] = useState(new Date())
  const today = new Date()
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const first = new Date(year, month, 1)
  const days = new Date(year, month + 1, 0).getDate()
  const start = (first.getDay() + 6) % 7
  const monthLabel = cursor.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  const cells = useMemo(() => Array.from({ length: Math.ceil((start + days) / 7) * 7 }, (_, i) => i - start + 1), [start, days])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Kalender Bulan Ini</h2>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"><ChevronLeft size={14} /></button>
          <button type="button" onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"><ChevronRight size={14} /></button>
          <button type="button" onClick={() => setCursor(new Date())} className="ml-1 rounded-md border border-slate-200 px-2 py-1.5 text-[11px] font-medium text-blue-600">Hari ini</button>
        </div>
      </div>
      <div className="mb-3 text-sm font-semibold capitalize text-slate-800">{monthLabel}</div>
      <div className="grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => <div key={day} className="py-1.5">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
        {cells.map((day, index) => {
          const active = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const valid = day > 0 && day <= days
          return <div key={index} className={`flex h-8 items-center justify-center rounded-md ${!valid ? 'text-transparent' : active ? 'bg-blue-600 font-semibold text-white' : 'text-slate-700 hover:bg-slate-50'}`}>{valid ? day : '·'}</div>
        })}
      </div>
    </section>
  )
}

function AgendaCard() {
  const [task, setTask] = useState('')
  const [items, setItems] = useState(agenda)
  const addTask = () => {
    const value = task.trim()
    if (!value) return
    setItems((current) => [...current, { time: '—', title: value, note: 'Catatan personal', icon: Leaf }])
    setTask('')
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2"><CalendarDays size={15} className="text-slate-500" /><h2 className="text-sm font-semibold text-slate-900">Agenda Hari Ini</h2></div>
        <button type="button" className="text-[11px] font-medium text-blue-600">Lihat Semua <ArrowRight size={12} className="ml-1 inline" /></button>
      </div>
      <div className="space-y-1.5">
        {items.slice(0, 5).map(({ time, title, note, icon: Icon }, index) => (
          <div key={`${title}-${index}`} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5">
            <span className="w-10 text-[10px] font-medium text-slate-400">{time}</span>
            <Icon size={15} className="shrink-0 text-blue-500" />
            <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-slate-800">{title}</div><div className="truncate text-[10px] text-slate-400">{note}</div></div>
            <span className="text-slate-300">⋮</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={task} onChange={(event) => setTask(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addTask()} placeholder="Tambah agenda..." className="min-w-0 flex-1 rounded-md border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400" />
        <button type="button" onClick={addTask} className="rounded-md bg-blue-600 px-3 text-white"><Plus size={15} /></button>
      </div>
    </section>
  )
}

export default function CalculationDashboard({ displayName }) {
  const now = new Date()
  const dateLabel = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-8 pt-6 sm:px-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500">Good morning,</div>
          <h1 className="mt-0.5 text-3xl font-semibold tracking-tight text-slate-900">{displayName}</h1>
          <p className="mt-1 text-xs text-slate-500">Temukan petunjuk hari ini melalui alam dan berbagai sistem kalender Cakra Langit.</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-xs font-semibold text-slate-800"><Sun size={16} className="text-amber-500" />{dateLabel}</div>
          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-500">Jakarta, Indonesia</div>
        </div>
      </div>

      <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2"><Leaf size={15} className="text-emerald-500" /><h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Natural Layer</h2></div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {natural.map(({ title, value, secondary, icon: Icon, tone }) => (
            <div key={title} className="rounded-lg border border-slate-100 bg-slate-50/40 p-3">
              <div className={`mb-3 flex items-center gap-2 text-[10px] font-medium ${tone}`}><Icon size={14} /><span className="text-slate-500">{title}</span></div>
              <div className="text-xs font-semibold text-slate-900">{value}</div>
              <div className="mt-1 text-[10px] leading-4 text-slate-400">{secondary}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <CalendarCard />
        <AgendaCard />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ['Terbit', '05:50', Sunrise, 'text-amber-500'],
          ['Kumulasi', '11:51', Sun, 'text-blue-500'],
          ['Terbenam', '17:51', Sunset, 'text-orange-500'],
        ].map(([label, value, Icon, tone]) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Icon size={17} className={tone} />
            <div><div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div><div className="text-sm font-semibold text-slate-800">{value}</div></div>
          </div>
        ))}
      </div>
    </section>
  )
}
