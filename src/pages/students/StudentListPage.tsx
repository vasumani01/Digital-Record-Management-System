import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Eye, Edit, Trash2, Upload, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

import { DataTable, type Column } from '@/components/common/DataTable'
import { SearchBar } from '@/components/common/SearchBar'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { type Student } from '@/types'
import { mockStudents } from '@/data/mockData'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<Student['status'], string> = {
  active: 'badge-success',
  inactive: 'badge-neutral',
  transferred: 'badge-warning',
  graduated: 'badge-info',
}

export function StudentListPage() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = students.filter((s) => {
    const matchStatus = !statusFilter || s.status === statusFilter
    const matchGrade = !gradeFilter || s.grade === gradeFilter
    return matchStatus && matchGrade
  })

  const grades = [...new Set(students.map((s) => s.grade))].sort()

  const handleDelete = () => {
    if (!deleteId) return
    setStudents((prev) => prev.filter((s) => s.id !== deleteId))
    setDeleteId(null)
    toast.success('Student record deleted.')
  }

  const columns: Column<Student>[] = [
    { key: 'student_id', header: 'ID', sortable: true },
    {
      key: 'full_name', header: 'Full Name', sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {s.full_name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
          </div>
          <span className="font-medium">{s.full_name}</span>
        </div>
      ),
    },
    { key: 'grade', header: 'Grade', sortable: true },
    { key: 'parent_name', header: 'Parent Name' },
    { key: 'parent_email', header: 'Parent Email' },
    { key: 'parent_phone', header: 'Phone' },
    {
      key: 'status', header: 'Status', sortable: true,
      render: (s) => (
        <span className={cn('badge', STATUS_STYLES[s.status])}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{students.length} total students</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/students/create')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Student
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <SearchBar value={search} onChange={setSearch} placeholder="Search students..." />
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="transferred">Transferred</option>
            <option value="graduated">Graduated</option>
          </select>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">All Grades</option>
            {grades.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable<Student>
        data={filtered}
        columns={columns}
        searchQuery={search}
        searchFields={['full_name', 'student_id', 'parent_name', 'parent_email']}
        exportFilename="students"
        emptyMessage="No students found. Try adjusting your filters."
        actions={(s: Student) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => navigate(`/students/${s.id}`)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/students/${s.id}/edit`)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast('Document upload coming soon!', { icon: '📄' })}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Upload Document"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteId(s.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-muted-foreground hover:text-red-500"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Student Record"
        description="Are you sure you want to delete this student? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  )
}
