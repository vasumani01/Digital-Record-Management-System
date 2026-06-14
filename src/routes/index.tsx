import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

// Auth
import { LoginPage } from '@/pages/auth/LoginPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'

// Dashboard
import { DashboardPage } from '@/pages/dashboard/DashboardPage'

// Students
import { StudentListPage } from '@/pages/students/StudentListPage'
import { StudentDetailsPage } from '@/pages/students/StudentDetailsPage'
import { CreateStudentPage, EditStudentPage } from '@/pages/students/StudentFormPage'

// Employees
import { EmployeeListPage } from '@/pages/employees/EmployeeListPage'
import { EmployeeDetailsPage } from '@/pages/employees/EmployeeDetailsPage'
import { CreateEmployeePage, EditEmployeePage } from '@/pages/employees/EmployeeFormPage'

// Documents
import { DocumentTablePage } from '@/pages/documents/DocumentTablePage'
import { DocumentUploadPage } from '@/pages/documents/DocumentUploadPage'

// OCR
import { OCRSearchPage } from '@/pages/ocr/OCRSearchPage'

// Messaging
import { ComposePage } from '@/pages/messaging/ComposePage'
import { MessageHistoryPage } from '@/pages/messaging/MessageHistoryPage'

// Certifications
import { CertificationPage } from '@/pages/certifications/CertificationPage'

// Audit
import { AuditLogsPage } from '@/pages/audit/AuditLogsPage'

// Notifications
import { NotificationPage } from '@/pages/notifications/NotificationPage'

// Settings
import { SettingsPage } from '@/pages/settings/SettingsPage'

const router = createBrowserRouter([
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },

  // Protected App routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },

          // Students (all roles can access)
          { path: '/students', element: <StudentListPage /> },
          { path: '/students/create', element: <CreateStudentPage /> },
          { path: '/students/:id', element: <StudentDetailsPage /> },
          { path: '/students/:id/edit', element: <EditStudentPage /> },

          // Employees (admin only)
          {
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [
              { path: '/employees', element: <EmployeeListPage /> },
              { path: '/employees/create', element: <CreateEmployeePage /> },
              { path: '/employees/:id', element: <EmployeeDetailsPage /> },
              { path: '/employees/:id/edit', element: <EditEmployeePage /> },
            ],
          },

          // Documents
          { path: '/documents', element: <DocumentTablePage /> },
          { path: '/documents/upload', element: <DocumentUploadPage /> },

          // OCR Search
          { path: '/ocr-search', element: <OCRSearchPage /> },

          // Messaging
          { path: '/messaging', element: <MessageHistoryPage /> },
          { path: '/messaging/compose', element: <ComposePage /> },
          { path: '/messaging/history', element: <MessageHistoryPage /> },

          // Certifications (admin only)
          {
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [
              { path: '/certifications', element: <CertificationPage /> },
            ],
          },

          // Audit (admin only)
          {
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [
              { path: '/audit', element: <AuditLogsPage /> },
            ],
          },

          // Notifications & Settings
          { path: '/notifications', element: <NotificationPage /> },
          { path: '/settings', element: <SettingsPage /> },

          // Catch-all
          { path: '*', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
