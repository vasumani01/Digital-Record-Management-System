import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Download, Trash2, RotateCcw, History, Search, Filter, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { DataTable, type Column } from '@/components/common/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { StatsCard } from '@/components/common/StatsCard'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { Document } from '@/types'
import { mockDocuments, mockDocumentVersions } from '@/data/mockData'
import { cn, formatDate, formatFileSize } from '@/lib/utils'
import { FileText } from 'lucide-react'

const STATUS_STYLES: Record<Document['status'], string> = {
  active: 'badge-success',
  archived: 'badge-neutral',
  pending: 'badge-warning',
  processing: 'badge-info',
}

const FILE_TYPE_COLORS: Record<string, string> = {
  PDF: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  DOCX: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  JPG: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  PNG: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
}

function VersionModal({ docId, onClose }: { docId: string | null; onClose: () => void }) {
  const versions = mockDocumentVersions.filter((v) => v.document_id === docId)

  return (
    <AnimatePresence>
      {docId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-lg">Version History</h3>
                <p className="text-sm text-muted-foreground">{versions.length} versions</p>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-3">
              {versions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No version history found.</p>
              ) : versions.map((v) => (
                <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    v{v.version_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Version {v.version_number}</p>
                      {v.is_current && <span className="badge badge-success text-[10px]">Current</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{v.uploaded_by_name} · {formatDate(v.created_at)}</p>
                    {v.notes && <p className="text-xs text-muted-foreground/70 mt-0.5">{v.notes}</p>}
                  </div>
                  {!v.is_current && (
                    <button onClick={() => toast.success(`Restored to version ${v.version_number}`)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function DocumentTablePage() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [versionDocId, setVersionDocId] = useState<string | null>(null)

  const categories = [...new Set(documents.map((d) => d.category))].sort()
  const filtered = documents.filter((d) => !categoryFilter || d.category === categoryFilter)

  const handleDelete = () => {
    if (!deleteId) return
    setDocuments((prev) => prev.filter((d) => d.id !== deleteId))
    setDeleteId(null)
    toast.success('Document deleted.')
  }

  const ocr = documents.filter((d) => d.ocr_indexed).length
  const recent = documents.filter((d) => {
    const date = new Date(d.created_at)
    const diff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 30
  }).length

  const columns: Column<Document>[] = [
    {
      key: 'name', header: 'Document Name', sortable: true,
      render: (d) => (
        <div className="flex items-center gap-2.5">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold', FILE_TYPE_COLORS[d.file_type] || 'bg-muted text-muted-foreground')}>
            {d.file_type}
          </div>
          <div>
            <p className="font-medium text-sm">{d.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(d.file_size)}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'owner_name', header: 'Owner', sortable: true },
    { key: 'created_at', header: 'Upload Date', sortable: true,
      render: (d) => <span className="text-sm">{formatDate(d.created_at)}</span> },
    { key: 'version', header: 'Version', render: (d) => <span className="badge badge-neutral">v{d.version}</span> },
    {
      key: 'ocr_indexed', header: 'OCR',
      render: (d) => d.ocr_indexed
        ? <span className="badge badge-success">Indexed</span>
        : <span className="badge badge-neutral">Pending</span>,
    },
    {
      key: 'status', header: 'Status', sortable: true,
      render: (d) => <span className={cn('badge', STATUS_STYLES[d.status])}>{d.status}</span>,
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Document Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{documents.length} total documents</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/documents/upload')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
          <Upload className="w-4 h-4" /> Upload Document
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard title="Total Documents" value={documents.length} color="blue" icon={<FileText className="w-5 h-5" />} />
        <StatsCard index={1} title="Recent Uploads" value={recent} color="teal" icon={<Upload className="w-5 h-5" />} description="last 30 days" />
        <StatsCard index={2} title="OCR Indexed" value={ocr} color="green" icon={<Search className="w-5 h-5" />} description="of total documents" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <SearchBar value={search} onChange={setSearch} placeholder="Search documents..." />
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <DataTable<Document>
        data={filtered} columns={columns}
        searchQuery={search}
        searchFields={['name', 'category', 'owner_name']}
        exportFilename="documents"
        emptyMessage="No documents found."
        actions={(d: Document) => (
          <div className="flex items-center justify-end gap-1">
            <button title="View" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
            <button title="Version History" onClick={() => setVersionDocId(d.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><History className="w-4 h-4" /></button>
            <button title="Download" onClick={() => toast.success('Downloading...')} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Download className="w-4 h-4" /></button>
            <button title="Delete" onClick={() => setDeleteId(d.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        )}
      />

      <VersionModal docId={versionDocId} onClose={() => setVersionDocId(null)} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Document" description="This will permanently delete the document and all its versions." confirmLabel="Delete" />
    </div>
  )
}
