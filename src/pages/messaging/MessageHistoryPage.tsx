import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Mail, Users, Clock } from 'lucide-react'
import { DataTable, type Column } from '@/components/common/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { mockMessages } from '@/data/mockData'
import type { Message } from '@/types'
import { cn, formatDateTime } from '@/lib/utils'

const STATUS_STYLES: Record<Message['status'], string> = {
  sent: 'badge-info',
  delivered: 'badge-success',
  failed: 'badge-danger',
  draft: 'badge-neutral',
}

export function MessageHistoryPage() {
  const [search, setSearch] = useState('')

  const columns: Column<Message>[] = [
    {
      key: 'subject', header: 'Subject', sortable: true,
      render: (m) => (
        <div>
          <p className="text-sm font-medium">{m.subject}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{m.sender_name}</p>
        </div>
      ),
    },
    {
      key: 'recipient_count', header: 'Recipients',
      render: (m) => (
        <div className="flex items-center gap-1.5 text-sm">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          {m.recipient_count} parent{m.recipient_count !== 1 ? 's' : ''}
        </div>
      ),
    },
    {
      key: 'status', header: 'Status', sortable: true,
      render: (m) => <span className={cn('badge', STATUS_STYLES[m.status])}>{m.status}</span>,
    },
    {
      key: 'sent_at', header: 'Sent At', sortable: true,
      render: (m) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {formatDateTime(m.sent_at)}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Message History</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{mockMessages.length} messages sent</p>
        </div>
        <Link to="/messaging/compose">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
            <Plus className="w-4 h-4" /> Compose
          </motion.button>
        </Link>
      </div>

      <div className="p-4 rounded-xl border border-border bg-card">
        <SearchBar value={search} onChange={setSearch} placeholder="Search messages..." />
      </div>

      <DataTable<Message>
        data={mockMessages} columns={columns}
        searchQuery={search}
        searchFields={['subject', 'sender_name']}
        emptyMessage="No messages found."
      />
    </div>
  )
}
