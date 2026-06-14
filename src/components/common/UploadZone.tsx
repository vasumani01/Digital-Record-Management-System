import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface UploadFile {
  file: File
  preview?: string
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
}

interface UploadZoneProps {
  files: UploadFile[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
}

export function UploadZone({
  files,
  onAdd,
  onRemove,
  accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
  },
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024,
}: UploadZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      onAdd(accepted)
    },
    [onAdd]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  })

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('docx')) return '📝'
    if (type.startsWith('image/')) return '🖼️'
    return '📁'
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200',
          isDragActive && !isDragReject && 'border-primary bg-primary/5',
          isDragReject && 'border-destructive bg-destructive/5',
          !isDragActive && 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ scale: isDragActive ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center',
            isDragActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}>
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or <span className="text-primary font-medium">click to browse</span>
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              PDF, DOCX, JPG, PNG • Max {formatFileSize(maxSize)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.map((uf, i) => (
          <motion.div
            key={uf.file.name + i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30"
          >
            <span className="text-2xl">{getFileIcon(uf.file.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{uf.file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(uf.file.size)}</p>
              {uf.status === 'uploading' && (
                <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${uf.progress}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {uf.status === 'done' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {uf.status === 'error' && <File className="w-4 h-4 text-red-500" />}
              <button
                onClick={() => onRemove(i)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
