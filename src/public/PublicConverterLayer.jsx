import { useAuth } from '../auth/AuthContext'

const converters = [
  {
    id: 'caka-sunda',
    name: 'Caka Sunda',
    description: 'Konversi kalender publik tanpa akun.',
  },
  {
    id: 'kalacakra',
    name: 'Kalacakra',
    description: 'Konversi tanggal publik tanpa masuk ke calculation profile.',
  },
]

export default function PublicConverterLayer() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-12 text-[#0F172A]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">
              Cakra Langit
            </p>
            <h1 className="text-3xl font-semibold">Public Converter Layer</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
              Converter publik tetap terbuka. Perhitungan personal dan calculation
              profile berada di Calculation Layer setelah login.
            </p>
          </div>
          <a
            href="/login"
            className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white"
          >
            {user ? 'Calculation Layer' : 'Masuk'}
          </a>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {converters.map((converter) => (
            <article
              key={converter.id}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">
                Converter
              </p>
              <h2 className="mt-2 text-xl font-semibold">{converter.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                {converter.description}
              </p>
              <div className="mt-5 rounded-lg bg-[#F8FAFC] px-3 py-2 text-xs text-[#64748B]">
                Converter engine hook — ready for the public layer.
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
