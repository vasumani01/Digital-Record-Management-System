// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'teacher'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  created_at: string
}

// ─── Student ──────────────────────────────────────────────────────────────────

export type StudentStatus = 'active' | 'inactive' | 'transferred' | 'graduated'

export interface Student {
  id: string
  student_id: string
  full_name: string
  grade: string
  parent_name: string
  parent_email: string
  parent_phone: string
  status: StudentStatus
  date_of_birth?: string
  address?: string
  created_at: string
  updated_at: string
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated'

export interface Employee {
  id: string
  employee_id: string
  name: string
  department: string
  position: string
  email: string
  phone: string
  status: EmployeeStatus
  hire_date?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// ─── Document ─────────────────────────────────────────────────────────────────

export type DocumentStatus = 'active' | 'archived' | 'pending' | 'processing'
export type DocumentCategory =
  | 'Student Records'
  | 'Employee Records'
  | 'Financial'
  | 'Administrative'
  | 'Legal'
  | 'Medical'
  | 'Other'

export interface Document {
  id: string
  name: string
  category: DocumentCategory
  owner_id: string
  owner_name: string
  file_url: string
  file_path?: string
  file_type: string
  file_size: number
  version: number
  ocr_indexed: boolean
  ocr_content?: string
  status: DocumentStatus
  created_at: string
  updated_at: string
}

export interface DocumentVersion {
  id: string
  document_id: string
  version_number: number
  file_url: string
  uploaded_by: string
  uploaded_by_name: string
  created_at: string
  is_current: boolean
  notes?: string
}

// ─── Certification ────────────────────────────────────────────────────────────

export type CertificationStatus = 'valid' | 'expiring' | 'expired'

export interface Certification {
  id: string
  name: string
  employee_id: string
  employee_name: string
  issue_date: string
  expiry_date: string
  status: CertificationStatus
  issued_by?: string
  created_at: string
}

// ─── Message ──────────────────────────────────────────────────────────────────

export type MessageStatus = 'sent' | 'delivered' | 'failed' | 'draft'

export interface Message {
  id: string
  subject: string
  body: string
  sender_id: string
  sender_name: string
  recipients: MessageRecipient[]
  status: MessageStatus
  sent_at: string
  recipient_count: number
}

export interface MessageRecipient {
  student_id: string
  student_name: string
  parent_name: string
  parent_email: string
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'EXPORT'
  | 'UPLOAD'
  | 'DOWNLOAD'

export type AuditModule =
  | 'Auth'
  | 'Students'
  | 'Employees'
  | 'Documents'
  | 'Certifications'
  | 'Messages'
  | 'Settings'
  | 'Audit'

export interface AuditLog {
  id: string
  user_id: string
  user_name: string
  action: AuditAction
  module: AuditModule
  details: string
  ip_address: string
  created_at: string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType =
  | 'certification_expiry'
  | 'ocr_completed'
  | 'new_upload'
  | 'message_sent'
  | 'failed_workflow'
  | 'info'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  created_at: string
  link?: string
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  total_students: number
  total_employees: number
  total_documents: number
  ocr_indexed: number
  expiring_certifications: number
  messages_sent: number
  student_growth: ChartDataPoint[]
  document_uploads: ChartDataPoint[]
  monthly_activity: ChartDataPoint[]
  employee_departments: PieChartData[]
}

export interface ChartDataPoint {
  month: string
  value: number
  value2?: number
}

export interface PieChartData {
  name: string
  value: number
  color: string
}

// ─── Table ───────────────────────────────────────────────────────────────────

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

export interface SortState {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterState {
  search: string
  [key: string]: string
}
