import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { UploadZone } from '@/components/common/UploadZone'
import { automationService } from '@/services/automation'

interface UploadFile {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
}

export function DocumentUploadPage() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<UploadFile[]>([])
  const [category, setCategory] = useState('')
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)

  const handleAdd = useCallback((added: File[]) => {
    setFiles((prev) => [...prev, ...added.map((f) => ({ file: f, progress: 0, status: 'pending' as const }))])
  }, [])

  const handleRemove = useCallback((i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i))
  }, [])

  const handleUpload = async () => {
    if (files.length === 0) { toast.error('Please add files first.'); return }
    if (!category) { toast.error('Please select a category.'); return }

    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const item = files[i]
        setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f))
        
        await automationService.uploadDocument(item.file, category, (p) => {
          setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, progress: p } : f))
        })

        setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: 'done', progress: 100 } : f))
      }
      toast.success(`${files.length} file(s) uploaded successfully!`)
      setDone(true)
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload files.')
      console.error(err)
      setFiles((prev) => prev.map((f) => f.status === 'uploading' ? { ...f, status: 'error' } : f))
    } finally {
      setUploading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-2xl">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Upload Complete</h2>
          <p className="text-muted-foreground text-sm mb-6">{files.length} file(s) have been uploaded successfully.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => { setFiles([]); setDone(false) }}
              className="px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted">
              Upload More
            </button>
            <button onClick={() => navigate('/documents')}
              className="px-4 py-2 text-sm rounded-xl bg-primary text-primary-foreground font-medium">
              View Documents
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold">Upload Documents</h1>
          <p className="text-muted-foreground text-sm">Drag and drop or browse to add files</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Document Category <span className="text-red-500">*</span>
          </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">Select category...</option>
            {['Student Records', 'Employee Records', 'Financial', 'Administrative', 'Legal', 'Medical', 'Other'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Upload Zone */}
        <UploadZone files={files} onAdd={handleAdd} onRemove={handleRemove} />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted">Cancel</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleUpload} disabled={uploading || files.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60">
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : <Send className="w-4 h-4" />}
            {uploading ? 'Uploading...' : `Upload ${files.length > 0 ? `(${files.length})` : ''}`}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
