import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Download, Trash2, RotateCcw, History, Search, Filter, Upload, FileText, AlertTriangle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataTable, type Column } from '@/components/common/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { StatsCard } from '@/components/common/StatsCard'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { SkeletonTable } from '@/components/common/SkeletonLoader'
import type { Document } from '@/types'
import { documentService } from '@/services/documentService'
import { supabase } from '@/lib/supabase'
import { cn, formatDate, formatFileSize } from '@/lib/utils'

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

export function DocumentTablePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null)

  const { data: documents = [], isLoading, error, refetch } = useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: () => documentService.getDocuments(),
  })

  const deleteMutation = useMutation({
    mutationFn: (d: Document) => documentService.deleteDocument(d.id, d.file_path || ''),
    onSuccess: () => {
      toast.success('Document deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setDeleteDoc(null)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete document.')
    }
  })

  const categories = [...new Set(documents.map((d) => d.category))].sort()
  const filtered = documents.filter((d) => !categoryFilter || d.category === categoryFilter)

  const handleDelete = () => {
    if (!deleteDoc) return
    deleteMutation.mutate(deleteDoc)
  }

  const handleDownload = async (d: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(d.file_path || '', 60)

      if (error) throw error
      window.open(data.signedUrl, '_blank')
      toast.success('Signed download link opened.')
    } catch (err: any) {
      toast.error('Failed to retrieve download link: ' + err.message)
    }
  }

  const handleView = async (d: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(d.file_path || '', 60)

      if (error) throw error
      window.open(data.signedUrl, '_blank')
    } catch (err: any) {
      toast.error('Failed to open document: ' + err.message)
    }
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
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0', FILE_TYPE_COLORS[d.file_type] || 'bg-muted text-muted-foreground')}>
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
    { key: 'owner_id', header: 'Owner ID', sortable: true },
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable rows={6} cols={6} />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 p-6 flex flex-col items-center text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
          <h3 className="font-semibold text-red-900 dark:text-red-400">Failed to load documents</h3>
          <p className="text-sm text-red-700 dark:text-red-500/80 mt-1 mb-4">{(error as any).message || 'An unexpected error occurred.'}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
            Try Again
          </button>
        </div>
      ) : (
        <DataTable<Document>
          data={filtered} columns={columns}
          searchQuery={search}
          searchFields={['name', 'category', 'owner_id']}
          exportFilename="documents"
          emptyMessage="No documents found."
          actions={(d: Document) => (
            <div className="flex items-center justify-end gap-1">
              <button title="View" onClick={() => handleView(d)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
              <button title="Download" onClick={() => handleDownload(d)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Download className="w-4 h-4" /></button>
              <button title="Delete" onClick={() => setDeleteDoc(d)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
        />
      )}

      <ConfirmDialog open={!!deleteDoc} onClose={() => setDeleteDoc(null)} onConfirm={handleDelete}
        title="Delete Document" description="This will permanently delete the document from PostgreSQL and storage vault. This action cannot be undone." confirmLabel="Delete" />
    </div>
  )
}
