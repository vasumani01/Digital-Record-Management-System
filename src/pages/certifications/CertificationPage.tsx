import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Filter, Calendar } from 'lucide-react'
import { DataTable, type Column } from '@/components/common/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { StatsCard } from '@/components/common/StatsCard'
import type { Certification } from '@/types'
import { mockCertifications } from '@/data/mockData'
import { cn, formatDate, getDaysUntil, getCertificationStatus } from '@/lib/utils'

const STATUS_STYLES = { valid: 'badge-success', expiring: 'badge-warning', expired: 'badge-danger' }

type DayFilter = '30' | '60' | '90' | 'all'

export function CertificationPage() {
  const [search, setSearch] = useState('')
  const [dayFilter, setDayFilter] = useState<DayFilter>('all')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = mockCertifications.filter((c) => {
    const days = getDaysUntil(c.expiry_date)
    const matchDay = dayFilter === 'all' || (days >= 0 && days <= Number(dayFilter))
    const matchStatus = !statusFilter || getCertificationStatus(c.expiry_date) === statusFilter
    return matchDay && matchStatus
  })

  const valid = mockCertifications.filter((c) => getCertificationStatus(c.expiry_date) === 'valid').length
  const expiring = mockCertifications.filter((c) => getCertificationStatus(c.expiry_date) === 'expiring').length
  const expired = mockCertifications.filter((c) => getCertificationStatus(c.expiry_date) === 'expired').length

  const columns: Column<Certification>[] = [
    { key: 'name', header: 'Certification Name', sortable: true },
    { key: 'employee_name', header: 'Employee', sortable: true },
    { key: 'issued_by', header: 'Issued By' },
    { key: 'issue_date', header: 'Issue Date', render: (c) => <span>{formatDate(c.issue_date)}</span> },
    {
      key: 'expiry_date', header: 'Expiry Date',
      render: (c) => {
        const days = getDaysUntil(c.expiry_date)
        const status = getCertificationStatus(c.expiry_date)
        return (
          <div>
            <p className="text-sm">{formatDate(c.expiry_date)}</p>
            <p className={cn('text-xs mt-0.5',
              status === 'expired' ? 'text-red-500' :
              status === 'expiring' ? 'text-amber-500' : 'text-green-500'
            )}>
              {status === 'expired' ? `Expired ${Math.abs(days)}d ago` :
               status === 'expiring' ? `Expires in ${days}d` : `Valid (${days}d left)`}
            </p>
          </div>
        )
      },
    },
    {
      key: 'status', header: 'Status', sortable: true,
      render: (c) => {
        const status = getCertificationStatus(c.expiry_date)
        return <span className={cn('badge', STATUS_STYLES[status])}>{status}</span>
      },
    },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Certification Tracking</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Monitor employee certification status and expiry</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard title="Valid" value={valid} color="green" icon={<Award className="w-5 h-5" />} />
        <StatsCard index={1} title="Expiring Soon" value={expiring} color="amber" icon={<Calendar className="w-5 h-5" />} description="within 90 days" />
        <StatsCard index={2} title="Expired" value={expired} color="red" icon={<Award className="w-5 h-5" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <SearchBar value={search} onChange={setSearch} placeholder="Search certifications..." />
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none">
            <option value="">All Status</option>
            <option value="valid">Valid</option>
            <option value="expiring">Expiring</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border overflow-hidden">
          {(['all', '30', '60', '90'] as DayFilter[]).map((d) => (
            <button key={d} onClick={() => setDayFilter(d)}
              className={cn('px-3 py-1.5 text-xs font-medium transition-colors',
                dayFilter === d ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
              {d === 'all' ? 'All' : `${d}d`}
            </button>
          ))}
        </div>
      </div>

      <DataTable<Certification>
        data={filtered} columns={columns}
        searchQuery={search}
        searchFields={['name', 'employee_name', 'issued_by']}
        exportFilename="certifications"
        emptyMessage="No certifications found."
      />
    </div>
  )
}
