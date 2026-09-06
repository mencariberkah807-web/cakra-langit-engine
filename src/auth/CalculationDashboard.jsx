import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, CloudSun, Eye, Leaf, Moon, Plus, Sparkles, Sun, Sunrise, Sunset } from 'lucide-react'

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
    <section className="month-calendar">
      <div className="month-calendar-heading">
        <div>
          <span className="eyebrow">Calendar</span>
          <h2>Kalender Bulan Ini</h2>
        </div>
        <div className="month-date-controls">
          <button type="button" onClick={() => setCursor(new Date(year, month - 1, 1))} className="month-nav-button"><ChevronLeft size={14} /></button>
          <button type="button" onClick={() => setCursor(new Date(year, month + 1, 1))} className="month-nav-button"><ChevronRight size={14} /></button>
          <button type="button" onClick={() => setCursor(new Date())} className="month-live-button">Hari ini</button>
        </div>
      </div>
      <div className="mb-3 text-sm font-semibold capitalize text-[#26364d]">{monthLabel}</div>
      <div className="month-weekdays">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="month-days">
        {cells.map((day, index) => {
          const active = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const valid = day > 0 && day <= days
          return <button type="button" key={index} disabled={!valid} className={`month-day ${!valid ? 'month-day-muted' : active ? 'month-day-selected' : ''}`}>{valid ? day : '·'}</button>
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
    <section className="timeline-section">
      <div className="timeline-item-header mb-4">
        <div>
          <span className="eyebrow">Today</span>
          <h2 className="mt-1 text-xl font-bold tracking-[-0.02em] text-[#1f2d3d]">Today Event</h2>
        </div>
        <button type="button" className="text-xs font-semibold text-[#26364d]">Lihat Semua <ArrowRight size={12} className="ml-1 inline" /></button>
      </div>
      <div className="timeline-list">
        {items.slice(0, 5).map(({ time, title, note, icon: Icon }, index) => (
          <div key={`${title}-${index}`} className="timeline-item">
            <span className="timeline-time">{time}</span>
            <span className="timeline-marker"><Icon size={14} className="sr-only" /></span>
            <div className="timeline-content">
              <div className="timeline-item-header"><h3>{title}</h3><span className="timeline-type">PERSONAL</span></div>
              <p>{note}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <input value={task} onChange={(event) => setTask(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addTask()} placeholder="Tambah agenda..." className="min-w-0 flex-1 rounded-lg border border-[#dfe5ec] bg-white px-3 py-2 text-xs text-[#26364d] outline-none focus:border-[#26364d]" />
        <button type="button" onClick={addTask} className="rounded-lg bg-[#26364d] px-3 text-white"><Plus size={15} /></button>
      </div>
    </section>
  )
}

export default function CalculationDashboard({ displayName }) {
  const now = new Date()
  const dateLabel = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <section className="app-shell">
      <div className="dashboard-section" style={{ marginTop: 0 }}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">Cakra Langit</span>
            <h2>Dashboard {displayName}</h2>
            <p className="mt-2 max-w-2xl text-sm text-[#718096]">Temukan petunjuk hari ini melalui alam dan berbagai sistem kalender Cakra Langit.</p>
          </div>
          <div className="section-status text-right">
            <div className="flex items-center justify-end gap-2 font-semibold text-[#26364d]"><Sun size={16} />{dateLabel}</div>
            <div className="mt-1">Jakarta, Indonesia</div>
          </div>
        </div>

        <section className="natural-summary">
          {natural.map(({ title, value, secondary, icon: Icon, tone }) => (
            <div key={title} className="natural-item">
              <div className="natural-item-heading flex items-center gap-2"><Icon size={14} className={tone} /><span className="natural-item-label">{title}</span></div>
              <p className="natural-item-primary">{value}</p>
              <p className="natural-item-secondary">{secondary}</p>
            </div>
          ))}
        </section>

        <div className="dashboard-main-layout">
          <div className="dashboard-main-left">
            <CalendarCard />
          </div>
          <div className="dashboard-main-right">
            <AgendaCard />
          </div>
        </div>

        <div className="dashboard-detail-section grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ['Terbit', '05:50', Sunrise, 'text-amber-500'],
            ['Kumulasi', '11:51', Sun, 'text-blue-500'],
            ['Terbenam', '17:51', Sunset, 'text-orange-500'],
          ].map(([label, value, Icon, tone]) => (
            <div key={label} className="calendar-detail flex items-center gap-3 !p-4">
              <Icon size={17} className={tone} />
              <div><div className="natural-item-label">{label}</div><div className="text-sm font-semibold text-[#26364d]">{value}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
