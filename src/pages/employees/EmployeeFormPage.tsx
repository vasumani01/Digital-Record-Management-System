import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Employee } from '@/types'
import { employeeService } from '@/services/employeeService'

function EmployeeForm({ initial = {}, onSubmit, isEdit = false }: {
  initial?: Partial<Employee>; onSubmit: (d: Partial<Employee>) => Promise<void>; isEdit?: boolean
}) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    employee_id: initial.employee_id || '',
    name: initial.name || '',
    department: initial.department || '',
    position: initial.position || '',
    email: initial.email || '',
    phone: initial.phone || '',
    hire_date: initial.hire_date || '',
    status: initial.status || 'active',
  })

  const u = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { k: 'employee_id', l: 'Employee ID', r: true },
          { k: 'name', l: 'Full Name', r: true },
          { k: 'department', l: 'Department', r: true },
          { k: 'position', l: 'Position', r: true },
          { k: 'email', l: 'Email Address', t: 'email', r: true },
          { k: 'phone', l: 'Phone Number', r: true },
          { k: 'hire_date', l: 'Hire Date', t: 'date' },
        ].map(({ k, l, t, r }) => (
          <div key={k}>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              {l} {r && <span className="text-red-500">*</span>}
            </label>
            <input type={t || 'text'} value={form[k as keyof typeof form]}
              onChange={(e) => u(k, e.target.value)} required={r}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => u('status', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
            {['active', 'inactive', 'on_leave', 'terminated'].map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted">Cancel</button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          type="submit" disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Create Employee'}
        </motion.button>
      </div>
    </form>
  )
}

export function CreateEmployeePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: employeeService.createEmployee,
    onSuccess: () => {
      toast.success('Employee created successfully!')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      navigate('/employees')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create employee.')
    }
  })

  const handleSubmit = async (d: Partial<Employee>) => {
    await mutation.mutateAsync(d)
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold">Add New Employee</h1>
          <p className="text-muted-foreground text-sm">Create a new employee record</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6"><EmployeeForm onSubmit={handleSubmit} /></div>
    </div>
  )
}

export function EditEmployeePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: employee, isLoading, error } = useQuery<Employee>({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getEmployeeById(id!),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: (d: Partial<Employee>) => employeeService.updateEmployee(id!, d),
    onSuccess: () => {
      toast.success('Employee updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['employee', id] })
      navigate('/employees')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update employee.')
    }
  })

  const handleSubmit = async (d: Partial<Employee>) => {
    const { id: _, created_at, updated_at, ...cleanData } = d as any
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
        <p className="text-red-500 font-medium">Failed to load employee details.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold">Edit Employee</h1>
          <p className="text-muted-foreground text-sm">{employee?.name} ({employee?.employee_id})</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <EmployeeForm initial={employee} onSubmit={handleSubmit} isEdit />
      </div>
    </div>
  )
}
