export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
      <main className="min-w-0">
        {children}
      </main>
    </div>
  )
}
