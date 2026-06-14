import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
  trend?: { value: number; label: string }
  color?: 'blue' | 'teal' | 'green' | 'amber' | 'red' | 'purple'
  index?: number
}

const colorMap = {
  blue: 'from-blue-500/20 to-blue-600/10 text-blue-500 border-blue-500/20',
  teal: 'from-teal-500/20 to-teal-600/10 text-teal-500 border-teal-500/20',
  green: 'from-green-500/20 to-green-600/10 text-green-500 border-green-500/20',
  amber: 'from-amber-500/20 to-amber-600/10 text-amber-500 border-amber-500/20',
  red: 'from-red-500/20 to-red-600/10 text-red-500 border-red-500/20',
  purple: 'from-purple-500/20 to-purple-600/10 text-purple-500 border-purple-500/20',
}

export function StatsCard({
  title, value, icon, description, trend, color = 'blue', index = 0,
}: StatsCardProps) {
  const isPositive = (trend?.value ?? 0) >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="stats-card"
    >
      {/* Icon + trend */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br border',
            colorMap[color]
          )}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-semibold px-2 py-1 rounded-full',
              isPositive
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {/* Value */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.08 + 0.2 }}
        className="text-3xl font-bold text-foreground"
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </motion.p>

      {/* Title */}
      <p className="text-sm text-muted-foreground mt-1">{title}</p>

      {/* Description */}
      {(description || trend) && (
        <p className="text-xs text-muted-foreground/70 mt-1.5">
          {trend?.label || description}
        </p>
      )}
    </motion.div>
  )
}
