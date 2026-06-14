import { useState, useRef, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Search, Sun, Moon, Monitor, ChevronRight,
  User, Settings, LogOut, Check, ExternalLink,
} from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useNotifications } from '@/contexts/NotificationContext'

const BREADCRUMB_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  students: 'Students',
  employees: 'Employees',
  documents: 'Documents',
  'ocr-search': 'OCR Search',
  messaging: 'Messaging',
  certifications: 'Certifications',
  audit: 'Audit Logs',
  settings: 'Settings',
  notifications: 'Notifications',
  create: 'Create',
  edit: 'Edit',
  details: 'Details',
  history: 'History',
  compose: 'Compose',
  upload: 'Upload',
}

const NOTIFICATION_ICONS: Record<string, string> = {
  certification_expiry: '🏆',
  ocr_completed: '🔍',
  new_upload: '📄',
  message_sent: '✉️',
  failed_workflow: '⚠️',
  info: 'ℹ️',
}

export function Header() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const location = useLocation()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showTheme, setShowTheme] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false)
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setShowTheme(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Breadcrumb
  const segments = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = segments.map((seg, i) => ({
    label: BREADCRUMB_MAP[seg] || seg,
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))

  const initials = user?.full_name?.split(' ').map((w) => w[0]).join('').slice(0, 2) || 'U'
  const recentNotifs = notifications.slice(0, 6)

  return (
    <header className="sticky top-0 z-20 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-6 gap-4">
      {/* Breadcrumb */}
      <nav className="flex-1 flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
            {crumb.isLast ? (
              <span className="font-semibold text-foreground">{crumb.label}</span>
            ) : (
              <Link to={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Search Hint */}
      <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-muted-foreground text-sm hover:bg-muted transition-colors">
        <Search className="w-3.5 h-3.5" />
        <span>Search...</span>
        <kbd className="ml-2 text-[10px] bg-background border border-border rounded px-1.5 py-0.5">⌘K</kbd>
      </button>

      {/* Theme Toggle */}
      <div ref={themeRef} className="relative">
        <button
          onClick={() => setShowTheme((v) => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showTheme && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 top-11 w-40 rounded-xl border border-border bg-popover shadow-lg overflow-hidden z-50"
            >
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTheme(t); setShowTheme(false) }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm capitalize hover:bg-muted transition-colors',
                    theme === t && 'text-primary font-medium'
                  )}
                >
                  {t === 'light' ? <Sun className="w-4 h-4" /> : t === 'dark' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  {t}
                  {theme === t && <Check className="w-3.5 h-3.5 ml-auto" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setShowNotifications((v) => !v)}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 top-11 w-80 rounded-xl border border-border bg-popover shadow-xl overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {recentNotifs.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">No notifications</div>
                ) : (
                  recentNotifs.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        'w-full text-left px-4 py-3 border-b border-border/50 last:border-0',
                        'hover:bg-muted/50 transition-colors',
                        !n.is_read && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-base mt-0.5">{NOTIFICATION_ICONS[n.type] || 'ℹ️'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium truncate">{n.title}</p>
                            {!n.is_read && (
                              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[11px] text-muted-foreground/70 mt-1">{formatRelativeTime(n.created_at)}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Profile */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => setShowProfile((v) => !v)}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium leading-tight">{user?.full_name?.split(' ').slice(0, 2).join(' ')}</p>
            <p className="text-xs text-muted-foreground capitalize leading-tight">{user?.role}</p>
          </div>
        </button>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 top-12 w-52 rounded-xl border border-border bg-popover shadow-xl overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <div className="border-t border-border">
                <button
                  onClick={() => { logout(); setShowProfile(false) }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
