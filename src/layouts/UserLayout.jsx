import AppSidebar from '../components/navigation/AppSidebar'

export default function UserLayout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
      <div className="flex min-h-screen items-start">
        <AppSidebar user={user} onLogout={onLogout} />
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
