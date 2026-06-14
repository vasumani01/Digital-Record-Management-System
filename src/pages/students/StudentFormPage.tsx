import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Student } from '@/types'
import { studentService } from '@/services/studentService'

interface StudentFormProps {
  initial?: Partial<Student>
  onSubmit: (data: Partial<Student>) => Promise<void>
  isEdit?: boolean
}

function StudentForm({ initial = {}, onSubmit, isEdit = false }: StudentFormProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    student_id: initial.student_id || '',
    full_name: initial.full_name || '',
    grade: initial.grade || '',
    parent_name: initial.parent_name || '',
    parent_email: initial.parent_email || '',
    parent_phone: initial.parent_phone || '',
    date_of_birth: initial.date_of_birth || '',
    address: initial.address || '',
    status: initial.status || 'active',
  })

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setLoading(false)
    }
  }

  const fields: { key: string; label: string; type?: string; required?: boolean; span?: boolean }[] = [
    { key: 'student_id', label: 'Student ID', required: true },
    { key: 'full_name', label: 'Full Name', required: true },
    { key: 'grade', label: 'Grade', required: true },
    { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
    { key: 'parent_name', label: 'Parent/Guardian Name', required: true },
    { key: 'parent_email', label: 'Parent Email', type: 'email', required: true },
    { key: 'parent_phone', label: 'Parent Phone', required: true },
    { key: 'address', label: 'Home Address', span: true },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className={f.span ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={f.type || 'text'}
              value={form[f.key as keyof typeof form]}
              onChange={(e) => update(f.key, e.target.value)}
              required={f.required}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {['active', 'inactive', 'transferred', 'graduated'].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted transition-colors">
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          type="submit" disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Saving...' : isEdit ? 'Update Student' : 'Create Student'}
        </motion.button>
      </div>
    </form>
  )
}

export function CreateStudentPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: studentService.createStudent,
    onSuccess: () => {
      toast.success('Student created successfully!')
      queryClient.invalidateQueries({ queryKey: ['students'] })
      navigate('/students')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create student.')
    }
  })

  const handleSubmit = async (data: Partial<Student>) => {
    await mutation.mutateAsync(data)
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Add New Student</h1>
          <p className="text-muted-foreground text-sm">Create a new student record in the system</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <StudentForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export function EditStudentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: student, isLoading, error } = useQuery<Student>({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudentById(id!),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: (data: Partial<Student>) => studentService.updateStudent(id!, data),
    onSuccess: () => {
      toast.success('Student updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['student', id] })
      navigate('/students')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update student.')
    }
  })

  const handleSubmit = async (data: Partial<Student>) => {
    const { id: _, created_at, updated_at, ...cleanData } = data as any
    await mutation.mutateAsync(cleanData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center border border-border rounded-xl bg-card">
        <p className="text-red-500 font-medium">Failed to load student details.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Edit Student</h1>
          <p className="text-muted-foreground text-sm">{student?.full_name} ({student?.student_id})</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <StudentForm initial={student} onSubmit={handleSubmit} isEdit />
      </div>
    </div>
  )
}
