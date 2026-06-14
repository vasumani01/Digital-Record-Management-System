import { motion } from 'framer-motion'
import { Bell, CheckCheck, Trash2, Award, Search, Upload, Mail, AlertTriangle, Info } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { NotificationType } from '@/types'

const TYPE_CONFIG: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  certification_expiry: {
    icon: <Award className="w-4 h-4" />,
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  },
  ocr_completed: {
    icon: <Search className="w-4 h-4" />,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  new_upload: {
    icon: <Upload className="w-4 h-4" />,
    color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  },
  message_sent: {
    icon: <Mail className="w-4 h-4" />,
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
  failed_workflow: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    color: 'bg-muted text-muted-foreground',
  },
}

export function NotificationPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications()

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {unreadCount} unread · {notifications.length} total
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-20 text-center rounded-xl border border-border bg-card">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-semibold">All caught up!</p>
            <p className="text-sm text-muted-foreground mt-1">No notifications to show.</p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.info
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-xl border transition-all',
                  n.is_read
                    ? 'border-border bg-card'
                    : 'border-primary/20 bg-primary/5 dark:border-primary/30'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', config.color)}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <p className="text-sm font-semibold flex-1">{n.title}</p>
                    {!n.is_read && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1.5">{formatRelativeTime(n.created_at)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!n.is_read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeNotification(n.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500 transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
