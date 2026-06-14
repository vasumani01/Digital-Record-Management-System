import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Award, FileText, Activity, Briefcase, Mail, Phone, Calendar } from 'lucide-react'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { mockEmployees, mockCertifications, mockDocuments } from '@/data/mockData'
import { cn, formatDate, getCertificationStatus } from '@/lib/utils'

const tabs = ['Profile', 'Certifications', 'Documents', 'Activity Logs'] as const
type Tab = typeof tabs[number]

const STATUS_STYLES = { valid: 'badge-success', expiring: 'badge-warning', expired: 'badge-danger' }

export function EmployeeDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('Profile')

  const emp = mockEmployees.find((e) => e.id === id) || mockEmployees[0]
  const certs = mockCertifications.filter((c) => c.employee_id === id || c.employee_id === emp.id)
  const docs = mockDocuments.filter((d) => d.owner_id === id || d.owner_id === emp.id)

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
            {certs.length === 0 ? (
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
            {docs.length === 0 ? (
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
              { id: 'ea1', title: 'Employee record created', description: 'Added to the system', user: 'Admin', timestamp: emp.created_at, iconBg: 'bg-green-100 text-green-600', icon: '✓' },
              { id: 'ea2', title: 'Profile last updated', user: 'Admin', timestamp: emp.updated_at, iconBg: 'bg-blue-100 text-blue-600', icon: '✎' },
            ]} />
          </div>
        )}
      </motion.div>
    </div>
  )
}
