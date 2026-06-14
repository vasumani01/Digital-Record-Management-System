import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Filter, Calendar, AlertTriangle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { DataTable, type Column } from '@/components/common/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { StatsCard } from '@/components/common/StatsCard'
import { SkeletonTable } from '@/components/common/SkeletonLoader'
import { certificationService } from '@/services/certificationService'
import type { Certification } from '@/types'
import { cn, formatDate, getDaysUntil, getCertificationStatus } from '@/lib/utils'

const STATUS_STYLES = { valid: 'badge-success', expiring: 'badge-warning', expired: 'badge-danger' }

type DayFilter = '30' | '60' | '90' | 'all'

export function CertificationPage() {
  const [search, setSearch] = useState('')
  const [dayFilter, setDayFilter] = useState<DayFilter>('all')
  const [statusFilter, setStatusFilter] = useState('')

  const { data: certifications = [], isLoading, error, refetch } = useQuery<Certification[]>({
    queryKey: ['certifications'],
    queryFn: () => certificationService.getCertifications(),
  })

  const filtered = certifications.filter((c) => {
    const days = getDaysUntil(c.expiry_date)
    const matchDay = dayFilter === 'all' || (days >= 0 && days <= Number(dayFilter))
    const matchStatus = !statusFilter || getCertificationStatus(c.expiry_date) === statusFilter
    return matchDay && matchStatus
  })

  const valid = certifications.filter((c) => getCertificationStatus(c.expiry_date) === 'valid').length
  const expiring = certifications.filter((c) => getCertificationStatus(c.expiry_date) === 'expiring').length
  const expired = certifications.filter((c) => getCertificationStatus(c.expiry_date) === 'expired').length

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
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

      {isLoading ? (
        <SkeletonTable rows={6} cols={6} />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 p-6 flex flex-col items-center text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
          <h3 className="font-semibold text-red-900 dark:text-red-400">Failed to load certifications</h3>
          <p className="text-sm text-red-700 dark:text-red-500/80 mt-1 mb-4">{(error as any).message || 'An unexpected error occurred.'}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
            Try Again
          </button>
        </div>
      ) : (
        <DataTable<Certification>
          data={filtered} columns={columns}
          searchQuery={search}
          searchFields={['name', 'employee_name', 'issued_by']}
          exportFilename="certifications"
          emptyMessage="No certifications found."
        />
      )}
    </div>
  )
}
