import { motion } from 'framer-motion'
import {
  Users, UserCheck, FileText, Search, Award, MessageSquare,
  LogIn, Upload, UserPlus, Edit, Clock, Bell, Loader, Loader2, AlertCircle
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { StatsCard } from '@/components/common/StatsCard'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { useAuth } from '@/contexts/AuthContext'
import { dashboardService } from '@/services/dashboardService'
import { auditService } from '@/services/auditService'
import { certificationService } from '@/services/certificationService'
import { getCertificationStatus, formatDate, getDaysUntil } from '@/lib/utils'
import { cn } from '@/lib/utils'

const ACTIVITY_ICONS: Record<string, { icon: React.ReactNode; bg: string }> = {
  LOGIN: { icon: <LogIn className="w-3.5 h-3.5" />, bg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' },
  LOGOUT: { icon: <LogIn className="w-3.5 h-3.5" />, bg: 'bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-450' },
  UPLOAD: { icon: <Upload className="w-3.5 h-3.5" />, bg: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400' },
  CREATE: { icon: <UserPlus className="w-3.5 h-3.5" />, bg: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' },
  UPDATE: { icon: <Edit className="w-3.5 h-3.5" />, bg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' },
  DELETE: { icon: <Search className="w-3.5 h-3.5" />, bg: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' },
  EXPORT: { icon: <FileText className="w-3.5 h-3.5" />, bg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
}

const ChartTooltipStyle = {
  contentStyle: {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '12px',
    fontSize: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  labelStyle: { color: 'hsl(var(--foreground))' },
}

export function AdminDashboard() {
  const { user } = useAuth()

  // Query dynamic stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getDashboardStats,
  })

  // Query recent audit logs
  const { data: auditLogs = [], isLoading: auditLoading } = useQuery({
    queryKey: ['recent-audit-logs'],
    queryFn: async () => {
      const logs = await auditService.getAuditLogs()
      return logs.slice(0, 5) // Get latest 5 actions
    }
  })

  // Query expiring/expired certifications
  const { data: certifications = [], isLoading: certsLoading } = useQuery({
    queryKey: ['dashboard-certifications'],
    queryFn: () => certificationService.getCertifications(),
  })

  if (statsLoading || auditLoading || certsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Aggregating system statistics...</p>
      </div>
    )
  }

  if (statsError || !stats) {
    return (
      <div className="p-6 text-center border border-border rounded-xl bg-card max-w-xl mx-auto mt-10">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1">Dashboard Load Failed</h3>
        <p className="text-muted-foreground text-sm">{(statsError as any)?.message || 'Failed to aggregate PostgreSQL database metrics.'}</p>
      </div>
    )
  }

  const expiring = certifications.filter(
    (c) => getCertificationStatus(c.expiry_date) !== 'valid'
  )

  const activityItems = auditLogs.map((a) => ({
    id: a.id,
    icon: ACTIVITY_ICONS[a.action]?.icon || <Clock className="w-3.5 h-3.5" />,
    iconBg: ACTIVITY_ICONS[a.action]?.bg || 'bg-muted text-muted-foreground',
    title: `${a.action} · ${a.module}`,
    description: a.details,
    user: a.user_name,
    timestamp: a.created_at,
  }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">
          Good morning, {user?.full_name?.split(' ')[1] || user?.full_name} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening in your system today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard index={0} title="Total Students" value={stats.total_students} color="blue"
          icon={<Users className="w-5 h-5" />} />
        <StatsCard index={1} title="Total Employees" value={stats.total_employees} color="teal"
          icon={<UserCheck className="w-5 h-5" />} />
        <StatsCard index={2} title="Total Documents" value={stats.total_documents} color="purple"
          icon={<FileText className="w-5 h-5" />} />
        <StatsCard index={3} title="OCR Indexed" value={stats.ocr_indexed} color="green"
          icon={<Search className="w-5 h-5" />}
          description="of total documents" />
        <StatsCard index={4} title="Expiring Certs" value={stats.expiring_certifications} color="amber"
          icon={<Award className="w-5 h-5" />}
          description="in next 90 days" />
        <StatsCard index={5} title="Messages Sent" value={stats.messages_sent} color="red"
          icon={<MessageSquare className="w-5 h-5" />} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Student Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Student Growth</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Enrollment trend over time</p>
            </div>
            <span className="badge badge-info">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.student_growth}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip {...ChartTooltipStyle} />
              <Area
                type="monotone" dataKey="value" name="Students"
                stroke="#2563EB" strokeWidth={2.5}
                fill="url(#colorStudents)" dot={{ r: 4, fill: '#2563EB' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Employee Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="mb-5">
            <h3 className="font-semibold text-foreground">Employee Distribution</h3>
            <p className="text-xs text-muted-foreground mt-0.5">By department</p>
          </div>
          {stats.employee_departments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground text-xs">
              No department data available.
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={stats.employee_departments}
                    cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                    paddingAngle={3} dataKey="value"
                  >
                    {stats.employee_departments.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...ChartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto">
                {stats.employee_departments.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Document Uploads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Document Uploads</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly upload statistics</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.document_uploads}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip {...ChartTooltipStyle} />
              <Bar dataKey="value" name="Documents" fill="#14B8A6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Monthly Activity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Actions vs. logins</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.monthly_activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip {...ChartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="value" name="Total Actions" stroke="#2563EB" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="value2" name="Logins" stroke="#14B8A6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row: Activity + Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
          {activityItems.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">No recent activity logged.</p>
          ) : (
            <ActivityTimeline items={activityItems} />
          )}
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Upcoming Tasks</h3>
          <div className="space-y-3">
            {expiring.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No expiring or expired employee certifications.</p>
            ) : (
              expiring.slice(0, 3).map((cert) => {
                const days = getDaysUntil(cert.expiry_date)
                const status = getCertificationStatus(cert.expiry_date)
                return (
                  <div key={cert.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      status === 'expired' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    )}>
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{cert.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{cert.employee_name}</p>
                    </div>
                    <span className={cn(
                      'badge shrink-0',
                      status === 'expired' ? 'badge-danger' : 'badge-warning'
                    )}>
                      {status === 'expired' ? 'Expired' : `${Math.abs(days)}d left`}
                    </span>
                  </div>
                )
              })
            )}

            {/* Pending items */}
            {[
              { icon: <Loader className="w-4 h-4" />, title: 'OCR Processing', desc: '0 documents queued', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
              { icon: <Bell className="w-4 h-4" />, title: 'Scheduled Notification', desc: 'PTM reminder - Auto-trigger active', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
              { icon: <Clock className="w-4 h-4" />, title: 'Report Generation', desc: 'Retention scan runs weekly', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' },
            ].map((task) => (
              <div key={task.title} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', task.color)}>
                  {task.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
