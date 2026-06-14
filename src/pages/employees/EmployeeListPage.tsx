import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Eye, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { DataTable, type Column } from '@/components/common/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { Employee } from '@/types'
import { mockEmployees } from '@/data/mockData'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<Employee['status'], string> = {
  active: 'badge-success',
  inactive: 'badge-neutral',
  on_leave: 'badge-warning',
  terminated: 'badge-danger',
}

export function EmployeeListPage() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const departments = [...new Set(employees.map((e) => e.department))].sort()

  const filtered = employees.filter((e) => !deptFilter || e.department === deptFilter)

  const handleDelete = () => {
    if (!deleteId) return
    setEmployees((prev) => prev.filter((e) => e.id !== deleteId))
    setDeleteId(null)
    toast.success('Employee record deleted.')
  }

  const columns: Column<Employee>[] = [
    { key: 'employee_id', header: 'ID', sortable: true },
    {
      key: 'name', header: 'Name', sortable: true,
      render: (e) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {e.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
          </div>
          <span className="font-medium">{e.name}</span>
        </div>
      ),
    },
    { key: 'department', header: 'Department', sortable: true },
    { key: 'position', header: 'Position', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'status', header: 'Status', sortable: true,
      render: (e) => (
        <span className={cn('badge', STATUS_STYLES[e.status])}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {e.status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{employees.length} total employees</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/employees/create')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" /> Add Employee
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <SearchBar value={search} onChange={setSearch} placeholder="Search employees..." />
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <DataTable<Employee>
        data={filtered}
        columns={columns}
        searchQuery={search}
        searchFields={['name', 'employee_id', 'email', 'department', 'position']}
        exportFilename="employees"
        emptyMessage="No employees found."
        actions={(e: Employee) => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => navigate(`/employees/${e.id}`)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="View">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => navigate(`/employees/${e.id}/edit`)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="Edit">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => setDeleteId(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-500" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Employee Record"
        description="This will permanently delete the employee record. This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  )
}
