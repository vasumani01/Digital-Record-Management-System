import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Award, FileText, Briefcase, Mail, Phone, Calendar, Loader2, AlertCircle } from 'lucide-react'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { useQuery } from '@tanstack/react-query'
import { employeeService } from '@/services/employeeService'
import { documentService } from '@/services/documentService'
import { certificationService } from '@/services/certificationService'
import { cn, formatDate, getCertificationStatus } from '@/lib/utils'

const tabs = ['Profile', 'Certifications', 'Documents', 'Activity Logs'] as const
type Tab = typeof tabs[number]

const STATUS_STYLES = { valid: 'badge-success', expiring: 'badge-warning', expired: 'badge-danger' }

export function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('Profile')

  // Query employee details
  const { data: emp, isLoading: empLoading, error: empError } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getEmployeeById(id!),
    enabled: !!id,
  })

  // Query employee certifications
  const { data: certs = [], isLoading: certsLoading } = useQuery({
    queryKey: ['employee-certifications', emp?.employee_id],
    queryFn: () => certificationService.getCertifications(emp?.employee_id),
    enabled: !!emp?.employee_id,
  })

  // Query employee documents
  const { data: docs = [], isLoading: docsLoading } = useQuery({
    queryKey: ['employee-documents', emp?.employee_id],
    queryFn: () => documentService.getDocuments(emp?.employee_id),
    enabled: !!emp?.employee_id,
  })

  if (empLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (empError || !emp) {
    return (
      <div className="p-6 text-center border border-border rounded-xl bg-card max-w-xl mx-auto mt-10">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1">Failed to load employee</h3>
        <p className="text-muted-foreground text-sm mb-4">{(empError as any)?.message || 'The employee record could not be found.'}</p>
        <button onClick={() => navigate('/employees')} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium">
          Back to Employees
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{emp.name}</h1>
          <p className="text-muted-foreground text-sm">{emp.employee_id} · {emp.position} · {emp.department}</p>
        </div>
        <button onClick={() => navigate(`/employees/${emp.id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted text-sm">
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>

      <div className="border-b border-border">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-all',
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
        {activeTab === 'Profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                {emp.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{emp.name}</h2>
                <p className="text-muted-foreground text-sm">{emp.position} · {emp.department}</p>
                <p className="text-xs text-muted-foreground mt-1">Joined {emp.hire_date ? formatDate(emp.hire_date) : '—'}</p>
              </div>
            </div>
            {[
              { icon: <Mail className="w-4 h-4" />, label: 'Email', value: emp.email },
              { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: emp.phone },
              { icon: <Briefcase className="w-4 h-4" />, label: 'Department', value: emp.department },
              { icon: <Calendar className="w-4 h-4" />, label: 'Hire Date', value: emp.hire_date ? formatDate(emp.hire_date) : '—' },
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

        {activeTab === 'Certifications' && (
          <div className="space-y-3">
            {certsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : certs.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No certifications found.</p>
              </div>
            ) : certs.map((cert) => {
              const status = getCertificationStatus(cert.expiry_date)
              return (
                <div key={cert.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center',
                    status === 'valid' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                    status === 'expiring' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                    'bg-red-100 dark:bg-red-900/30 text-red-600'
                  )}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">Expires: {formatDate(cert.expiry_date)} · {cert.issued_by}</p>
                  </div>
                  <span className={cn('badge', STATUS_STYLES[status])}>{status}</span>
                </div>
              )
            })}
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
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No documents found.</p>
              </div>
            ) : docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.category} · {formatDate(doc.created_at)}</p>
                </div>
                <span className="badge badge-info">{doc.file_type}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Activity Logs' && (
          <div className="rounded-xl border border-border bg-card p-5">
            <ActivityTimeline items={[
              { id: 'ea1', title: 'Employee record created', description: 'Added to the system', user: 'System Trigger', timestamp: emp.created_at, iconBg: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400', icon: '✓' }
            ]} />
          </div>
        )}
      </motion.div>
    </div>
  )
}
