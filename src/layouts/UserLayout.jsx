import AppSidebar from '../components/navigation/AppSidebar'

export default function UserLayout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-[#07111C] font-sans text-white antialiased">
      <div className="flex min-h-screen items-start">
        <AppSidebar user={user} onLogout={onLogout} />
        <main className="min-w-0 flex-1 bg-[#07111C]">
          {children}
        </main>
      </div>
    </div>
  )
}
