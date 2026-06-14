import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, FileText, MessageSquare, Activity, User, Phone, Mail, MapPin, Loader2, AlertCircle } from 'lucide-react'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { useQuery } from '@tanstack/react-query'
import { studentService } from '@/services/studentService'
import { documentService } from '@/services/documentService'
import { cn, formatDate } from '@/lib/utils'

const tabs = ['Personal Info', 'Documents', 'Communication', 'Activity Logs'] as const
type Tab = typeof tabs[number]

export function StudentDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('Personal Info')

  // Query student details
  const { data: student, isLoading: studentLoading, error: studentError } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudentById(id!),
    enabled: !!id,
  })

  // Query student documents (we query by student_id or id)
  const { data: docs = [], isLoading: docsLoading } = useQuery({
    queryKey: ['student-documents', student?.student_id],
    queryFn: () => documentService.getDocuments(student?.student_id),
    enabled: !!student?.student_id,
  })

  const statusColors = {
    active: 'badge-success',
    inactive: 'badge-neutral',
    transferred: 'badge-warning',
    graduated: 'badge-info',
  }

  if (studentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (studentError || !student) {
    return (
      <div className="p-6 text-center border border-border rounded-xl bg-card max-w-xl mx-auto mt-10">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1">Failed to load student</h3>
        <p className="text-muted-foreground text-sm mb-4">{(studentError as any)?.message || 'The student record could not be found.'}</p>
        <button onClick={() => navigate('/students')} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium">
          Back to Students
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{student.full_name}</h1>
          <p className="text-muted-foreground text-sm">{student.student_id} • Grade {student.grade}</p>
        </div>
        <span className={cn('badge', statusColors[student.status])}>
          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
        </span>
        <button
          onClick={() => navigate(`/students/${student.id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted text-sm transition-colors"
        >
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-all',
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {activeTab === 'Personal Info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Card */}
            <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {student.full_name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{student.full_name}</h2>
                <p className="text-muted-foreground text-sm">{student.student_id} · Grade {student.grade}</p>
                <p className="text-xs text-muted-foreground mt-1">Added {formatDate(student.created_at)}</p>
              </div>
            </div>

            {/* Info Fields */}
            {[
              { icon: <User className="w-4 h-4" />, label: 'Parent / Guardian', value: student.parent_name },
              { icon: <Mail className="w-4 h-4" />, label: 'Parent Email', value: student.parent_email },
              { icon: <Phone className="w-4 h-4" />, label: 'Parent Phone', value: student.parent_phone },
              { icon: <Activity className="w-4 h-4" />, label: 'Date of Birth', value: student.date_of_birth ? formatDate(student.date_of_birth) : '—' },
              { icon: <MapPin className="w-4 h-4" />, label: 'Address', value: student.address || '—' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  {item.icon}
                  <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
                </div>
                <p className="text-sm font-medium text-foreground mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Documents' && (
          <div className="space-y-3">
            {docsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : docs.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No documents uploaded yet.</p>
              </div>
            ) : docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.category} · {formatDate(doc.created_at)}</p>
                </div>
                <span className="badge badge-info text-xs">{doc.file_type}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Communication' && (
          <div className="py-16 text-center text-muted-foreground">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No communications recorded yet.</p>
          </div>
        )}

        {activeTab === 'Activity Logs' && (
          <div className="rounded-xl border border-border bg-card p-5">
            <ActivityTimeline items={[
              { id: 'a1', title: 'Student record created', description: 'Initial record added to the system', user: 'System Trigger', timestamp: student.created_at, iconBg: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400', icon: '✓' },
            ]} />
          </div>
        )}
      </motion.div>
    </div>
  )
}
