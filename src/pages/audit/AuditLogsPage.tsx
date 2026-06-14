import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, LayoutList, GitBranch } from 'lucide-react'
import { DataTable, type Column } from '@/components/common/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import type { AuditLog } from '@/types'
import { mockAuditLogs } from '@/data/mockData'
import { cn, formatDateTime } from '@/lib/utils'

const ACTION_STYLES: Record<string, string> = {
  LOGIN: 'badge-info',
  LOGOUT: 'badge-neutral',
  CREATE: 'badge-success',
  UPDATE: 'badge-warning',
  DELETE: 'badge-danger',
  VIEW: 'badge-neutral',
  EXPORT: 'badge-info',
  UPLOAD: 'badge-success',
  DOWNLOAD: 'badge-neutral',
}

const ACTION_ICONS: Record<string, string> = {
  LOGIN: '🔑', LOGOUT: '🚪', CREATE: '✨', UPDATE: '✏️',
  DELETE: '🗑️', VIEW: '👁️', EXPORT: '📤', UPLOAD: '📥', DOWNLOAD: '⬇️',
}

export function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table')

  const filtered = mockAuditLogs.filter((l) => {
    const matchAction = !actionFilter || l.action === actionFilter
    const matchModule = !moduleFilter || l.module === moduleFilter
    return matchAction && matchModule
  })

  const modules = [...new Set(mockAuditLogs.map((l) => l.module))].sort()

  const columns: Column<AuditLog>[] = [
    { key: 'user_name', header: 'User', sortable: true,
      render: (l) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
            {l.user_name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
          </div>
          <span className="text-sm font-medium">{l.user_name}</span>
        </div>
      ),
    },
    { key: 'action', header: 'Action', sortable: true,
      render: (l) => (
        <span className={cn('badge', ACTION_STYLES[l.action] || 'badge-neutral')}>
          {ACTION_ICONS[l.action]} {l.action}
        </span>
      ),
    },
    { key: 'module', header: 'Module', sortable: true,
      render: (l) => <span className="badge badge-info">{l.module}</span>,
    },
    { key: 'details', header: 'Details',
      render: (l) => <p className="text-sm text-muted-foreground max-w-xs truncate">{l.details}</p>,
    },
    { key: 'ip_address', header: 'IP Address',
      render: (l) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{l.ip_address}</code>,
    },
    { key: 'created_at', header: 'Timestamp', sortable: true,
      render: (l) => <span className="text-sm text-muted-foreground">{formatDateTime(l.created_at)}</span>,
    },
  ]

  const timelineItems = filtered.map((l) => ({
    id: l.id,
    icon: ACTION_ICONS[l.action] || '●',
    iconBg: cn('flex items-center justify-center',
      l.action === 'CREATE' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
      l.action === 'DELETE' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
      l.action === 'LOGIN' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
      'bg-muted text-muted-foreground'
    ),
    title: `${l.action} · ${l.module}`,
    description: l.details,
    user: `${l.user_name} · ${l.ip_address}`,
    timestamp: l.created_at,
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{mockAuditLogs.length} total entries</p>
        </div>
        <div className="flex items-center rounded-xl border border-border overflow-hidden">
          <button onClick={() => setViewMode('table')}
            className={cn('flex items-center gap-2 px-3 py-2 text-sm transition-colors',
              viewMode === 'table' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
            <LayoutList className="w-4 h-4" /> Table
          </button>
          <button onClick={() => setViewMode('timeline')}
            className={cn('flex items-center gap-2 px-3 py-2 text-sm transition-colors',
              viewMode === 'timeline' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
            <GitBranch className="w-4 h-4" /> Timeline
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <SearchBar value={search} onChange={setSearch} placeholder="Search logs..." />
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none">
            <option value="">All Actions</option>
            {['LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'UPLOAD', 'EXPORT', 'DOWNLOAD'].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none">
            <option value="">All Modules</option>
            {modules.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <motion.div key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {viewMode === 'table' ? (
          <DataTable<AuditLog>
            data={filtered} columns={columns}
            searchQuery={search}
            searchFields={['user_name', 'details', 'ip_address']}
            exportFilename="audit_logs"
            emptyMessage="No audit logs found."
          />
        ) : (
          <div className="rounded-xl border border-border bg-card p-5">
            <ActivityTimeline items={timelineItems} />
          </div>
        )}
      </motion.div>
    </div>
  )
}
