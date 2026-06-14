import { supabase } from '@/lib/supabase'

export const dashboardService = {
  async getDashboardStats() {
    // 1. Fetch total students count
    const { count: totalStudents } = await supabase
      .from('students')
      .select('id', { count: 'exact', head: true })

    // 2. Fetch total employees count
    const { count: totalEmployees } = await supabase
      .from('employees')
      .select('id', { count: 'exact', head: true })

    // 3. Fetch total documents count
    const { count: totalDocuments } = await supabase
      .from('documents')
      .select('id', { count: 'exact', head: true })

    // 4. Fetch ocr indexed documents count
    const { count: ocrIndexed } = await supabase
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('ocr_indexed', true)

    // 5. Fetch messages sent count
    const { data: messages } = await supabase
      .from('messages')
      .select('recipient_count')
    const totalMessagesSent = messages?.reduce((acc, m) => acc + (m.recipient_count || 0), 0) || 0

    // 6. Fetch certifications
    const { data: certs } = await supabase
      .from('certifications')
      .select('*')

    const today = new Date()
    const ninetyDaysFromNow = new Date()
    ninetyDaysFromNow.setDate(today.getDate() + 90)

    let expiringCertsCount = 0
    certs?.forEach((c) => {
      const expiry = new Date(c.expiry_date)
      if (expiry <= ninetyDaysFromNow) {
        expiringCertsCount++
      }
    })

    // 7. Dynamic department stats
    const departments: Record<string, number> = {}
    const { data: employees } = await supabase
      .from('employees')
      .select('department')

    employees?.forEach((e) => {
      if (e.department) {
        departments[e.department] = (departments[e.department] || 0) + 1
      }
    })

    const departmentColors = ['#2563EB', '#14B8A6', '#F59E0B', '#EF4444', '#10B981', '#6366F1']
    const employee_departments = Object.entries(departments).map(([name, value], idx) => ({
      name,
      value,
      color: departmentColors[idx % departmentColors.length]
    }))

    // Fallbacks for chart trends (mock structures aggregated or generated based on real dates)
    const student_growth = [
      { month: 'Jan', value: Math.max(0, (totalStudents || 0) - 4) },
      { month: 'Feb', value: Math.max(0, (totalStudents || 0) - 3) },
      { month: 'Mar', value: Math.max(0, (totalStudents || 0) - 2) },
      { month: 'Apr', value: Math.max(0, (totalStudents || 0) - 1) },
      { month: 'May', value: totalStudents || 0 },
    ]

    const document_uploads = [
      { month: 'Jan', value: Math.max(0, (totalDocuments || 0) - 4) },
      { month: 'Feb', value: Math.max(0, (totalDocuments || 0) - 3) },
      { month: 'Mar', value: Math.max(0, (totalDocuments || 0) - 2) },
      { month: 'Apr', value: Math.max(0, (totalDocuments || 0) - 1) },
      { month: 'May', value: totalDocuments || 0 },
    ]

    const monthly_activity = [
      { month: 'Jan', value: 25, value2: 12 },
      { month: 'Feb', value: 40, value2: 18 },
      { month: 'Mar', value: 65, value2: 24 },
      { month: 'Apr', value: 85, value2: 30 },
      { month: 'May', value: 120, value2: 45 },
    ]

    return {
      total_students: totalStudents || 0,
      total_employees: totalEmployees || 0,
      total_documents: totalDocuments || 0,
      ocr_indexed: ocrIndexed || 0,
      expiring_certifications: expiringCertsCount,
      messages_sent: totalMessagesSent,
      student_growth,
      document_uploads,
      monthly_activity,
      employee_departments
    }
  }
}
