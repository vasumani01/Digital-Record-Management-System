import { useAuth } from '@/contexts/AuthContext'
import { AdminDashboard } from './AdminDashboard'
import { TeacherDashboard } from './TeacherDashboard'

export function DashboardPage() {
  const { hasRole } = useAuth()
  return hasRole('admin') ? <AdminDashboard /> : <TeacherDashboard />
}
