import type {
  Student, Employee, Document, Certification, Message,
  AuditLog, Notification, DashboardStats, DocumentVersion,
} from '@/types'

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  total_students: 1247,
  total_employees: 89,
  total_documents: 3841,
  ocr_indexed: 2956,
  expiring_certifications: 12,
  messages_sent: 483,
  student_growth: [
    { month: 'Jan', value: 980 },
    { month: 'Feb', value: 1020 },
    { month: 'Mar', value: 1085 },
    { month: 'Apr', value: 1100 },
    { month: 'May', value: 1180 },
    { month: 'Jun', value: 1247 },
    { month: 'Jul', value: 1290 },
    { month: 'Aug', value: 1340 },
  ],
  document_uploads: [
    { month: 'Jan', value: 320 },
    { month: 'Feb', value: 410 },
    { month: 'Mar', value: 380 },
    { month: 'Apr', value: 520 },
    { month: 'May', value: 490 },
    { month: 'Jun', value: 610 },
    { month: 'Jul', value: 570 },
    { month: 'Aug', value: 640 },
  ],
  monthly_activity: [
    { month: 'Jan', value: 1200, value2: 800 },
    { month: 'Feb', value: 1450, value2: 920 },
    { month: 'Mar', value: 1300, value2: 850 },
    { month: 'Apr', value: 1600, value2: 1100 },
    { month: 'May', value: 1550, value2: 1050 },
    { month: 'Jun', value: 1800, value2: 1200 },
    { month: 'Jul', value: 1700, value2: 1150 },
    { month: 'Aug', value: 1950, value2: 1300 },
  ],
  employee_departments: [
    { name: 'Teaching', value: 45, color: '#2563EB' },
    { name: 'Administration', value: 20, color: '#14B8A6' },
    { name: 'Support', value: 15, color: '#22C55E' },
    { name: 'Technical', value: 9, color: '#F59E0B' },
    { name: 'Management', value: 10, color: '#8B5CF6' },
  ],
}

// ─── Students ─────────────────────────────────────────────────────────────────
export const mockStudents: Student[] = [
  {
    id: 's1', student_id: 'STU-001', full_name: 'Aanya Sharma', grade: '10-A',
    parent_name: 'Rajesh Sharma', parent_email: 'rajesh.sharma@email.com',
    parent_phone: '+91 98765 43210', status: 'active',
    date_of_birth: '2010-03-15', address: '42, MG Road, Chennai, TN 600001',
    created_at: '2024-06-01T09:00:00Z', updated_at: '2025-01-10T11:30:00Z',
  },
  {
    id: 's2', student_id: 'STU-002', full_name: 'Arjun Patel', grade: '11-B',
    parent_name: 'Sunita Patel', parent_email: 'sunita.patel@email.com',
    parent_phone: '+91 87654 32109', status: 'active',
    date_of_birth: '2009-07-22', address: '18, Anna Nagar, Chennai, TN 600040',
    created_at: '2024-06-02T10:00:00Z', updated_at: '2025-02-05T14:20:00Z',
  },
  {
    id: 's3', student_id: 'STU-003', full_name: 'Priya Nair', grade: '9-C',
    parent_name: 'Mohan Nair', parent_email: 'mohan.nair@email.com',
    parent_phone: '+91 76543 21098', status: 'inactive',
    date_of_birth: '2011-11-08', address: '7, Besant Nagar, Chennai, TN 600090',
    created_at: '2024-07-15T08:00:00Z', updated_at: '2025-01-20T09:45:00Z',
  },
  {
    id: 's4', student_id: 'STU-004', full_name: 'Karan Mehta', grade: '12-A',
    parent_name: 'Pooja Mehta', parent_email: 'pooja.mehta@email.com',
    parent_phone: '+91 65432 10987', status: 'active',
    date_of_birth: '2008-05-30', address: '25, T Nagar, Chennai, TN 600017',
    created_at: '2024-05-20T11:00:00Z', updated_at: '2025-03-01T16:00:00Z',
  },
  {
    id: 's5', student_id: 'STU-005', full_name: 'Deepa Krishnan', grade: '10-B',
    parent_name: 'Suresh Krishnan', parent_email: 'suresh.k@email.com',
    parent_phone: '+91 54321 09876', status: 'active',
    date_of_birth: '2010-09-12', address: '3, Adyar, Chennai, TN 600020',
    created_at: '2024-06-10T09:30:00Z', updated_at: '2025-02-28T10:15:00Z',
  },
  {
    id: 's6', student_id: 'STU-006', full_name: 'Rohan Verma', grade: '11-A',
    parent_name: 'Anita Verma', parent_email: 'anita.verma@email.com',
    parent_phone: '+91 43210 98765', status: 'transferred',
    date_of_birth: '2009-12-25', address: '11, Velachery, Chennai, TN 600042',
    created_at: '2024-04-15T10:00:00Z', updated_at: '2025-01-05T12:00:00Z',
  },
  {
    id: 's7', student_id: 'STU-007', full_name: 'Meera Iyer', grade: '8-A',
    parent_name: 'Venkat Iyer', parent_email: 'venkat.iyer@email.com',
    parent_phone: '+91 32109 87654', status: 'active',
    date_of_birth: '2012-02-14', address: '56, Kodambakkam, Chennai, TN 600024',
    created_at: '2024-07-01T08:30:00Z', updated_at: '2025-03-10T15:30:00Z',
  },
  {
    id: 's8', student_id: 'STU-008', full_name: 'Vikram Singh', grade: '12-B',
    parent_name: 'Ranjit Singh', parent_email: 'ranjit.singh@email.com',
    parent_phone: '+91 21098 76543', status: 'active',
    date_of_birth: '2008-08-19', address: '28, Porur, Chennai, TN 600116',
    created_at: '2024-05-05T09:00:00Z', updated_at: '2025-02-15T11:45:00Z',
  },
]

// ─── Employees ────────────────────────────────────────────────────────────────
export const mockEmployees: Employee[] = [
  {
    id: 'e1', employee_id: 'EMP-001', name: 'Dr. Kavitha Rajan', department: 'Teaching',
    position: 'Head of Science', email: 'kavitha.rajan@school.edu',
    phone: '+91 98765 11111', status: 'active', hire_date: '2018-07-15',
    created_at: '2018-07-15T09:00:00Z', updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'e2', employee_id: 'EMP-002', name: 'Mr. Suresh Babu', department: 'Administration',
    position: 'Principal', email: 'suresh.babu@school.edu',
    phone: '+91 87654 22222', status: 'active', hire_date: '2015-01-10',
    created_at: '2015-01-10T09:00:00Z', updated_at: '2025-03-01T09:00:00Z',
  },
  {
    id: 'e3', employee_id: 'EMP-003', name: 'Ms. Preethi Joseph', department: 'Teaching',
    position: 'English Teacher', email: 'preethi.joseph@school.edu',
    phone: '+91 76543 33333', status: 'active', hire_date: '2020-06-01',
    created_at: '2020-06-01T09:00:00Z', updated_at: '2024-12-15T14:00:00Z',
  },
  {
    id: 'e4', employee_id: 'EMP-004', name: 'Mr. Arun Kumar', department: 'Technical',
    position: 'IT Administrator', email: 'arun.kumar@school.edu',
    phone: '+91 65432 44444', status: 'active', hire_date: '2021-03-15',
    created_at: '2021-03-15T09:00:00Z', updated_at: '2025-02-20T11:00:00Z',
  },
  {
    id: 'e5', employee_id: 'EMP-005', name: 'Mrs. Lalitha Devi', department: 'Support',
    position: 'Librarian', email: 'lalitha.devi@school.edu',
    phone: '+91 54321 55555', status: 'on_leave', hire_date: '2019-08-01',
    created_at: '2019-08-01T09:00:00Z', updated_at: '2025-01-30T10:00:00Z',
  },
  {
    id: 'e6', employee_id: 'EMP-006', name: 'Mr. Dinesh Raj', department: 'Teaching',
    position: 'Mathematics Teacher', email: 'dinesh.raj@school.edu',
    phone: '+91 43210 66666', status: 'active', hire_date: '2022-06-15',
    created_at: '2022-06-15T09:00:00Z', updated_at: '2025-03-05T13:00:00Z',
  },
]

// ─── Documents ────────────────────────────────────────────────────────────────
export const mockDocuments: Document[] = [
  {
    id: 'd1', name: 'Student Enrollment Form - 2024', category: 'Student Records',
    owner_id: 's1', owner_name: 'Aanya Sharma', file_url: '#', file_type: 'PDF',
    file_size: 245760, version: 2, ocr_indexed: true,
    ocr_content: 'Student enrollment form with personal details, guardian information, and academic history...',
    status: 'active', created_at: '2024-06-01T10:00:00Z', updated_at: '2024-09-15T14:00:00Z',
  },
  {
    id: 'd2', name: 'Teacher Certification - Kavitha Rajan', category: 'Employee Records',
    owner_id: 'e1', owner_name: 'Dr. Kavitha Rajan', file_url: '#', file_type: 'PDF',
    file_size: 512000, version: 1, ocr_indexed: true,
    ocr_content: 'Teaching certification issued by the State Board of Education...',
    status: 'active', created_at: '2024-03-20T09:00:00Z', updated_at: '2024-03-20T09:00:00Z',
  },
  {
    id: 'd3', name: 'Q3 Financial Report 2024', category: 'Financial',
    owner_id: 'e2', owner_name: 'Mr. Suresh Babu', file_url: '#', file_type: 'DOCX',
    file_size: 892928, version: 3, ocr_indexed: false,
    status: 'active', created_at: '2024-10-01T11:00:00Z', updated_at: '2024-11-05T16:30:00Z',
  },
  {
    id: 'd4', name: 'School Policy Manual 2025', category: 'Administrative',
    owner_id: 'e2', owner_name: 'Mr. Suresh Babu', file_url: '#', file_type: 'PDF',
    file_size: 2097152, version: 5, ocr_indexed: true,
    ocr_content: 'Comprehensive school policy manual covering student conduct, academic guidelines...',
    status: 'active', created_at: '2025-01-10T08:00:00Z', updated_at: '2025-01-10T08:00:00Z',
  },
  {
    id: 'd5', name: 'Medical Certificate - Priya Nair', category: 'Medical',
    owner_id: 's3', owner_name: 'Priya Nair', file_url: '#', file_type: 'JPG',
    file_size: 153600, version: 1, ocr_indexed: false,
    status: 'pending', created_at: '2025-02-14T14:00:00Z', updated_at: '2025-02-14T14:00:00Z',
  },
  {
    id: 'd6', name: 'Legal Agreement - School Bus Service', category: 'Legal',
    owner_id: 'e2', owner_name: 'Mr. Suresh Babu', file_url: '#', file_type: 'PDF',
    file_size: 348160, version: 1, ocr_indexed: true,
    ocr_content: 'Transportation service agreement between the school and ABC Bus Services...',
    status: 'active', created_at: '2024-08-01T10:00:00Z', updated_at: '2024-08-01T10:00:00Z',
  },
]

// ─── Document Versions ────────────────────────────────────────────────────────
export const mockDocumentVersions: DocumentVersion[] = [
  {
    id: 'dv1', document_id: 'd1', version_number: 2, file_url: '#',
    uploaded_by: 'e2', uploaded_by_name: 'Mr. Suresh Babu',
    created_at: '2024-09-15T14:00:00Z', is_current: true,
    notes: 'Updated guardian contact information',
  },
  {
    id: 'dv2', document_id: 'd1', version_number: 1, file_url: '#',
    uploaded_by: 'e2', uploaded_by_name: 'Mr. Suresh Babu',
    created_at: '2024-06-01T10:00:00Z', is_current: false,
    notes: 'Initial upload',
  },
]

// ─── Certifications ───────────────────────────────────────────────────────────
export const mockCertifications: Certification[] = [
  {
    id: 'c1', name: 'B.Ed - Bachelor of Education', employee_id: 'e1',
    employee_name: 'Dr. Kavitha Rajan', issue_date: '2018-05-20',
    expiry_date: '2028-05-19', status: 'valid',
    issued_by: 'University of Madras', created_at: '2018-05-20T09:00:00Z',
  },
  {
    id: 'c2', name: 'First Aid & CPR', employee_id: 'e3',
    employee_name: 'Ms. Preethi Joseph', issue_date: '2023-08-15',
    expiry_date: '2025-08-14', status: 'expiring',
    issued_by: 'Red Cross Society', created_at: '2023-08-15T09:00:00Z',
  },
  {
    id: 'c3', name: 'Child Safety Training', employee_id: 'e5',
    employee_name: 'Mrs. Lalitha Devi', issue_date: '2022-01-10',
    expiry_date: '2025-01-09', status: 'expired',
    issued_by: 'State Child Protection Board', created_at: '2022-01-10T09:00:00Z',
  },
  {
    id: 'c4', name: 'Digital Literacy Certification', employee_id: 'e4',
    employee_name: 'Mr. Arun Kumar', issue_date: '2024-03-01',
    expiry_date: '2026-02-28', status: 'valid',
    issued_by: 'NASSCOM', created_at: '2024-03-01T09:00:00Z',
  },
  {
    id: 'c5', name: 'Fire Safety Officer', employee_id: 'e6',
    employee_name: 'Mr. Dinesh Raj', issue_date: '2023-06-20',
    expiry_date: '2025-07-15', status: 'expiring',
    issued_by: 'Fire Safety Institute', created_at: '2023-06-20T09:00:00Z',
  },
]

// ─── Messages ─────────────────────────────────────────────────────────────────
export const mockMessages: Message[] = [
  {
    id: 'm1', subject: 'Annual Day Celebration - Invitation',
    body: '<p>Dear Parents, We are pleased to invite you to our Annual Day celebration...</p>',
    sender_id: 'e2', sender_name: 'Mr. Suresh Babu',
    recipients: [
      { student_id: 's1', student_name: 'Aanya Sharma', parent_name: 'Rajesh Sharma', parent_email: 'rajesh.sharma@email.com' },
      { student_id: 's2', student_name: 'Arjun Patel', parent_name: 'Sunita Patel', parent_email: 'sunita.patel@email.com' },
    ],
    status: 'delivered', sent_at: '2025-02-20T10:00:00Z', recipient_count: 2,
  },
  {
    id: 'm2', subject: 'Parent-Teacher Meeting - March 2025',
    body: '<p>Dear Parents, We would like to schedule a parent-teacher meeting...</p>',
    sender_id: 'e2', sender_name: 'Mr. Suresh Babu',
    recipients: [
      { student_id: 's4', student_name: 'Karan Mehta', parent_name: 'Pooja Mehta', parent_email: 'pooja.mehta@email.com' },
    ],
    status: 'sent', sent_at: '2025-03-01T09:00:00Z', recipient_count: 1,
  },
  {
    id: 'm3', subject: 'Exam Schedule - Term 2',
    body: '<p>Dear Parents, Please find attached the examination schedule for Term 2...</p>',
    sender_id: 'e1', sender_name: 'Dr. Kavitha Rajan',
    recipients: [
      { student_id: 's5', student_name: 'Deepa Krishnan', parent_name: 'Suresh Krishnan', parent_email: 'suresh.k@email.com' },
    ],
    status: 'failed', sent_at: '2025-03-10T14:00:00Z', recipient_count: 1,
  },
]

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'al1', user_id: 'e2', user_name: 'Mr. Suresh Babu', action: 'LOGIN',
    module: 'Auth', details: 'Successful login from Chrome/Windows',
    ip_address: '192.168.1.101', created_at: '2025-06-14T08:00:00Z',
  },
  {
    id: 'al2', user_id: 'e2', user_name: 'Mr. Suresh Babu', action: 'UPLOAD',
    module: 'Documents', details: 'Uploaded School Policy Manual 2025',
    ip_address: '192.168.1.101', created_at: '2025-06-14T08:15:00Z',
  },
  {
    id: 'al3', user_id: 'e1', user_name: 'Dr. Kavitha Rajan', action: 'CREATE',
    module: 'Students', details: 'Created new student record: Aanya Sharma (STU-001)',
    ip_address: '192.168.1.105', created_at: '2025-06-13T14:30:00Z',
  },
  {
    id: 'al4', user_id: 'e3', user_name: 'Ms. Preethi Joseph', action: 'LOGIN',
    module: 'Auth', details: 'Successful login from Firefox/Mac',
    ip_address: '192.168.1.110', created_at: '2025-06-13T09:00:00Z',
  },
  {
    id: 'al5', user_id: 'e2', user_name: 'Mr. Suresh Babu', action: 'EXPORT',
    module: 'Students', details: 'Exported student list to CSV (8 records)',
    ip_address: '192.168.1.101', created_at: '2025-06-12T16:45:00Z',
  },
  {
    id: 'al6', user_id: 'e4', user_name: 'Mr. Arun Kumar', action: 'UPDATE',
    module: 'Employees', details: 'Updated employee profile: Mrs. Lalitha Devi',
    ip_address: '192.168.1.120', created_at: '2025-06-12T11:20:00Z',
  },
  {
    id: 'al7', user_id: 'e1', user_name: 'Dr. Kavitha Rajan', action: 'DELETE',
    module: 'Documents', details: 'Deleted document: Old Enrollment Form 2023',
    ip_address: '192.168.1.105', created_at: '2025-06-11T15:00:00Z',
  },
]

// ─── Notifications ────────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  {
    id: 'n1', user_id: 'e2', type: 'certification_expiry',
    title: 'Certification Expiring Soon',
    message: 'Ms. Preethi Joseph\'s First Aid & CPR certification expires in 61 days.',
    is_read: false, created_at: '2025-06-14T07:00:00Z',
    link: '/certifications',
  },
  {
    id: 'n2', user_id: 'e2', type: 'ocr_completed',
    title: 'OCR Processing Complete',
    message: 'School Policy Manual 2025 has been successfully indexed.',
    is_read: false, created_at: '2025-06-14T06:30:00Z',
    link: '/documents',
  },
  {
    id: 'n3', user_id: 'e2', type: 'new_upload',
    title: 'New Document Uploaded',
    message: 'Medical Certificate for Priya Nair has been uploaded and is pending review.',
    is_read: false, created_at: '2025-06-13T14:00:00Z',
    link: '/documents',
  },
  {
    id: 'n4', user_id: 'e2', type: 'message_sent',
    title: 'Message Delivered',
    message: 'Annual Day invitation has been delivered to 2 parents.',
    is_read: true, created_at: '2025-06-13T10:00:00Z',
    link: '/messaging/history',
  },
  {
    id: 'n5', user_id: 'e2', type: 'failed_workflow',
    title: 'Message Delivery Failed',
    message: 'Exam Schedule message failed to deliver to 1 recipient.',
    is_read: true, created_at: '2025-06-12T14:00:00Z',
    link: '/messaging/history',
  },
]

// ─── Recent Activity ──────────────────────────────────────────────────────────
export interface ActivityItem {
  id: string
  type: 'login' | 'upload' | 'create' | 'update' | 'delete' | 'export' | 'message'
  title: string
  description: string
  user: string
  timestamp: string
}

export const mockRecentActivity: ActivityItem[] = [
  {
    id: 'a1', type: 'login', title: 'User Login',
    description: 'Mr. Suresh Babu logged in from Chrome/Windows',
    user: 'Mr. Suresh Babu', timestamp: '2025-06-14T08:00:00Z',
  },
  {
    id: 'a2', type: 'upload', title: 'Document Uploaded',
    description: 'School Policy Manual 2025 uploaded by Mr. Suresh Babu',
    user: 'Mr. Suresh Babu', timestamp: '2025-06-14T08:15:00Z',
  },
  {
    id: 'a3', type: 'create', title: 'Student Created',
    description: 'New student Aanya Sharma (STU-001) added by Dr. Kavitha Rajan',
    user: 'Dr. Kavitha Rajan', timestamp: '2025-06-13T14:30:00Z',
  },
  {
    id: 'a4', type: 'message', title: 'Message Sent',
    description: 'Annual Day invitation sent to 2 parents',
    user: 'Mr. Suresh Babu', timestamp: '2025-06-13T10:00:00Z',
  },
  {
    id: 'a5', type: 'update', title: 'Employee Updated',
    description: 'Mrs. Lalitha Devi\'s profile updated by Mr. Arun Kumar',
    user: 'Mr. Arun Kumar', timestamp: '2025-06-12T11:20:00Z',
  },
]

// ─── Mock Users ───────────────────────────────────────────────────────────────
export const mockUsers = {
  admin: {
    id: 'u1',
    email: 'admin@drms.edu',
    full_name: 'Mr. Suresh Babu',
    role: 'admin' as const,
    avatar_url: undefined,
    created_at: '2015-01-10T09:00:00Z',
  },
  teacher: {
    id: 'u2',
    email: 'teacher@drms.edu',
    full_name: 'Dr. Kavitha Rajan',
    role: 'teacher' as const,
    avatar_url: undefined,
    created_at: '2018-07-15T09:00:00Z',
  },
}
