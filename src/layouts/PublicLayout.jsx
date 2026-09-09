export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#07111C] font-sans text-white antialiased">
      <main className="min-w-0">
        {children}
      </main>
    </div>
  )
}
