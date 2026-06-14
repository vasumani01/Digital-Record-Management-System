import { motion } from 'framer-motion'
import { Users, FileText, MessageSquare, Search, Loader2, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { StatsCard } from '@/components/common/StatsCard'
import { useAuth } from '@/contexts/AuthContext'
import { dashboardService } from '@/services/dashboardService'

export function TeacherDashboard() {
  const { user } = useAuth()

  // Query dynamic stats
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getDashboardStats,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Loading statistics...</p>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-6 text-center border border-border rounded-xl bg-card max-w-xl mx-auto mt-10">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1">Dashboard Load Failed</h3>
        <p className="text-muted-foreground text-sm">{(error as any)?.message || 'Failed to aggregate PostgreSQL database metrics.'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, {user?.full_name?.split(' ').slice(1).join(' ') || user?.full_name} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Your teacher dashboard overview</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard index={0} title="Total Students" value={stats.total_students}
          color="blue" icon={<Users className="w-5 h-5" />} />
        <StatsCard index={1} title="Total Documents" value={stats.total_documents}
          color="teal" icon={<FileText className="w-5 h-5" />} />
        <StatsCard index={2} title="Messages Sent" value={stats.messages_sent}
          color="green" icon={<MessageSquare className="w-5 h-5" />} />
        <StatsCard index={3} title="OCR Indexed" value={stats.ocr_indexed}
          color="purple" icon={<Search className="w-5 h-5" />} />
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h3 className="font-semibold mb-2">Quick Access</h3>
        <p className="text-sm text-muted-foreground">
          Use the sidebar to navigate to Student Management, Documents, OCR Search, or Messaging.
        </p>
      </motion.div>
    </div>
  )
}
