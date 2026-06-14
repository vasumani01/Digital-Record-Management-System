import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Toaster } from 'react-hot-toast'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
        <footer className="shrink-0 border-t border-border px-6 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>© 2025 DRMS — Digital Records Management System</span>
            <span>v1.0.0</span>
          </div>
        </footer>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '!bg-popover !text-foreground !border !border-border !shadow-lg !rounded-xl text-sm',
          duration: 4000,
        }}
      />
    </div>
  )
}
