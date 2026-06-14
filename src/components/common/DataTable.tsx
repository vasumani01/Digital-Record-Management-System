import { useState, useMemo, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchQuery?: string
  searchFields?: (keyof T)[]
  pageSize?: number
  onRowClick?: (row: T) => void
  exportFilename?: string
  emptyMessage?: string
  isLoading?: boolean
  actions?: (row: T) => ReactNode
  keyField?: keyof T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportToCSVLocal(data: any[], filename: string, keys: string[]) {
  const csvContent = [
    keys.join(','),
    ...data.map((row) =>
      keys.map((k) => `"${String(row[k] ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function DataTable<T>({
  data,
  columns,
  searchQuery = '',
  searchFields = [],
  pageSize: defaultPageSize = 10,
  onRowClick,
  exportFilename,
  emptyMessage = 'No records found.',
  isLoading = false,
  actions,
  keyField = 'id' as keyof T,
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
    setPage(1)
  }

  const filtered = useMemo(() => {
    if (!searchQuery || searchFields.length === 0) return data
    const q = searchQuery.toLowerCase()
    return data.filter((row) =>
      searchFields.some((f) => String((row as Record<keyof T, unknown>)[f] ?? '').toLowerCase().includes(q))
    )
  }, [data, searchQuery, searchFields])

  const sorted = useMemo(() => {
    if (!sortField) return filtered
    return [...filtered].sort((a, b) => {
      const ar = a as Record<string, unknown>
      const br = b as Record<string, unknown>
      const av = String(ar[sortField] ?? '')
      const bv = String(br[sortField] ?? '')
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [filtered, sortField, sortDir])

  const totalPages = Math.ceil(sorted.length / pageSize) || 1
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary" />
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3.5 border-b border-border/50 last:border-0">
            {columns.map((_, j) => (
              <div key={j} className="flex-1 h-4 skeleton" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap',
                      col.sortable && 'cursor-pointer hover:text-foreground select-none',
                      col.className
                    )}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && <SortIcon field={String(col.key)} />}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (actions ? 1 : 0)} className="py-16 text-center text-muted-foreground">
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  paginated.map((row, i) => {
                    const rowRecord = row as Record<string, unknown>
                    return (
                      <motion.tr
                        key={String(rowRecord[String(keyField)] ?? i)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={cn(
                          'data-table-row',
                          onRowClick && 'cursor-pointer'
                        )}
                        onClick={() => onRowClick?.(row)}
                      >
                        {columns.map((col) => (
                          <td key={String(col.key)} className={cn('px-4 py-3 text-sm', col.className)}>
                            {col.render
                              ? col.render(row)
                              : String(rowRecord[String(col.key)] ?? '—')}
                          </td>
                        ))}
                        {actions && (
                          <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            {actions(row)}
                          </td>
                        )}
                      </motion.tr>
                    )
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
            className="text-sm border border-border rounded-md px-2 py-1 bg-background"
          >
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="ml-2">
            {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {exportFilename && filtered.length > 0 && (
            <button
              onClick={() => exportToCSVLocal(
                filtered,
                exportFilename,
                columns.filter((c) => !c.render).map((c) => String(c.key))
              )}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          )}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
