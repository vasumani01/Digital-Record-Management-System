import { motion } from 'framer-motion'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { ReactNode } from 'react'

interface TimelineItem {
  id: string
  icon?: ReactNode
  iconBg?: string
  title: string
  description?: string
  timestamp: string
  user?: string
}

interface ActivityTimelineProps {
  items: TimelineItem[]
  className?: string
}

export function ActivityTimeline({ items, className }: ActivityTimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex gap-3 relative pb-5 last:pb-0"
        >
          {/* Line */}
          {i < items.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
          )}

          {/* Icon */}
          <div
            className={cn(
              'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm z-10',
              item.iconBg || 'bg-muted text-muted-foreground'
            )}
          >
            {item.icon || '●'}
          </div>

          {/* Content */}
          <div className="flex-1 pt-0.5 min-w-0">
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              {item.user && (
                <span className="text-[11px] text-muted-foreground/80">{item.user}</span>
              )}
              {item.user && <span className="text-[11px] text-muted-foreground/50">·</span>}
              <span className="text-[11px] text-muted-foreground/70">{formatRelativeTime(item.timestamp)}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
