import { useState } from 'react'

const week = [
  { day: 'Sen', date: '1 Sep', tone: 'Baik', toneClass: 'bg-emerald-50 text-emerald-700', items: ['08:00 Meditasi pagi', '10:00 Review Weton', '14:00 Rencana proyek'] },
  { day: 'Sel', date: '2 Sep', tone: 'Cukup', toneClass: 'bg-amber-50 text-amber-700', items: ['09:00 Analisis BaZi', '13:00 Meeting tim', '20:00 Catat mimpi'] },
  { day: 'Rab', date: '3 Sep', tone: 'Tantangan', toneClass: 'bg-rose-50 text-rose-700', items: ['08:00 Puasa ringan', '11:00 Riset Paririmbon', '16:00 Olahraga'] },
  { day: 'Kam', date: '4 Sep', tone: 'Baik', toneClass: 'bg-emerald-50 text-emerald-700', items: ['09:00 Konsultasi', '14:00 Tulis jurnal', '19:00 Quality time'] },
  { day: 'Jum', date: '5 Sep', tone: 'Sangat Baik', toneClass: 'bg-emerald-50 text-emerald-700', items: ['08:00 Persiapan presentasi', '13:00 Upload konten', '20:00 Evaluasi minggu'] },
  { day: 'Sab', date: '6 Sep', tone: 'Baik', toneClass: 'bg-blue-50 text-blue-700', active: true, items: ['07:00 Meditasi & doa', '10:00 Pelajari Almanac', '19:00 Baca Paririmbon'] },
  { day: 'Min', date: '7 Sep', tone: 'Cukup', toneClass: 'bg-amber-50 text-amber-700', items: ['09:00 Istirahat', '15:00 Jalan santai', '19:00 Rencana minggu depan'] },
]

const engines = [
  { name: 'Weton', icon: '☀', desc: 'Neptu, watak, dan arah kehidupan.', cls: 'bg-amber-50 border-amber-100 text-amber-800' },
  { name: 'BaZi', icon: '東', desc: 'Empat pilar takdir dan keseimbangan.', cls: 'bg-blue-50 border-blue-100 text-blue-800' },
  { name: 'Paririmbon', icon: '▣', desc: 'Acuan hari baik, pantangan, dan ritual.', cls: 'bg-violet-50 border-violet-100 text-violet-800' },
  { name: 'Almanac', icon: '☾', desc: 'Siklus bulan, musim, dan fenomena langit.', cls: 'bg-emerald-50 border-emerald-100 text-emerald-800' },
]

export default function CalculationDashboard() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([
    { text: 'Siapkan materi BaZi', done: true, time: '10:30' },
    { text: 'Review hasil Weton', done: false, time: '13:00' },
    { text: 'Meditasi pagi', done: false, time: '06:00' },
    { text: 'Catat mimpi', done: false, time: '21:00' },
  ])

  const addTask = () => {
    const value = task.trim()
    if (!value) return
    setTasks((current) => [...current, { text: value, done: false, time: 'Hari ini' }])
    setTask('')
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Weekly Calendar</h2>
            <p className="text-sm text-slate-500">Hasil kalkulasi berbagai sistem dan rencana Anda.</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button className="rounded-lg border px-2.5 py-1.5">‹</button>
            <button className="rounded-lg border px-2.5 py-1.5">›</button>
            <span className="px-2 font-medium">1–7 September 2025</span>
          </div>
        </div>
        <div className="grid min-w-[920px] grid-cols-7 gap-2 overflow-x-auto">
          {week.map((item) => (
            <div key={item.day} className={`rounded-xl border p-2 ${item.active ? 'border-blue-400 bg-blue-50/50' : 'border-slate-100 bg-slate-50/40'}`}>
              <div className="border-b border-slate-100 pb-2 text-center">
                <div className="text-sm font-semibold">{item.day}</div>
                <div className="text-xs text-slate-500">{item.date}</div>
                <div className={`mx-auto mt-2 w-fit rounded-full px-2 py-1 text-[10px] font-medium ${item.toneClass}`}>● {item.tone}</div>
              </div>
              <div className="space-y-2 pt-2">
                {item.items.map((value) => <div key={value} className="rounded-lg border border-slate-100 bg-white px-2 py-2 text-[11px] leading-4 shadow-sm">{value}</div>)}
                <button className="w-full rounded-lg border border-dashed border-slate-200 py-2 text-xs text-blue-600">＋ Tambah</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Add Task</h2>
            <span className="text-xl text-blue-600">＋</span>
          </div>
          <div className="flex gap-2">
            <input value={task} onChange={(event) => setTask(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addTask()} placeholder="Apa yang ingin Anda lakukan?" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            <button onClick={addTask} className="rounded-lg bg-blue-600 px-4 text-white">＋</button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Tasks</h2>
            <span className="text-xs text-blue-600">Lihat Semua →</span>
          </div>
          <div className="space-y-1">
            {tasks.map((item, index) => (
              <label key={`${item.text}-${index}`} className="flex items-center gap-3 border-b border-slate-100 py-2.5 text-sm">
                <input type="checkbox" checked={item.done} onChange={() => setTasks((current) => current.map((taskItem, taskIndex) => taskIndex === index ? { ...taskItem, done: !taskItem.done } : taskItem))} className="h-4 w-4 accent-blue-600" />
                <span className={item.done ? 'flex-1 text-slate-400 line-through' : 'flex-1'}>{item.text}</span>
                <span className="text-xs text-slate-400">{item.time}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Engine Calculation</h2>
            <p className="text-sm text-slate-500">Akses cepat ke berbagai sistem pengetahuan.</p>
          </div>
          <span className="text-sm text-blue-600">Lihat Semua →</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {engines.map((engine) => (
            <button key={engine.name} className={`group rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${engine.cls}`}>
              <div className="mb-5 flex items-center justify-between">
                <span className="text-3xl">{engine.icon}</span>
                <span className="rounded-full bg-white/70 px-2 py-1 text-lg">→</span>
              </div>
              <div className="text-base font-semibold">{engine.name}</div>
              <p className="mt-1 min-h-10 text-xs leading-5 opacity-80">{engine.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </section>
  )
}
