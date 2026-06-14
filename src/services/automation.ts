import toast from 'react-hot-toast'
import type { Student, Employee } from '@/types'
import { supabase } from '@/lib/supabase'

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL

/**
 * Service to handle form metadata and file uploads via n8n automation webhook.
 * Falls back to direct Supabase calls or mock behavior if no webhook is specified.
 */
export const automationService = {
  /**
   * Registers a student, uploading metadata and any files (e.g. ID proof, certificates)
   */
  async submitStudentRegistration(student: Partial<Student>, files: File[] = []): Promise<void> {
    if (N8N_WEBHOOK_URL) {
      const formData = new FormData()
      formData.append('type', 'student_registration')
      formData.append('metadata', JSON.stringify(student))
      files.forEach((f, i) => {
        formData.append(`file_${i}`, f)
      })

      const response = await fetch(`${N8N_WEBHOOK_URL}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`n8n automation failed: ${response.statusText}`)
      }
      return
    }

    // Fallback: Direct Supabase insert
    const { data: user } = await supabase.auth.getUser()
    const { error } = await supabase.from('students').insert({
      student_id: student.student_id,
      full_name: student.full_name,
      grade: student.grade,
      parent_name: student.parent_name,
      parent_email: student.parent_email,
      parent_phone: student.parent_phone,
      date_of_birth: student.date_of_birth,
      address: student.address,
      status: student.status,
      created_by: user?.user?.id,
    })

    if (error) throw error

    // Upload files if any directly to Supabase storage
    for (const f of files) {
      const filePath = `students/${student.student_id}/${f.name}`
      const { error: uploadErr } = await supabase.storage
        .from('documents')
        .upload(filePath, f)
      if (uploadErr) {
        toast.error(`Failed to upload ${f.name} directly to storage.`)
      } else {
        // Create document metadata entry
        await supabase.from('documents').insert({
          name: f.name,
          file_path: filePath,
          file_type: f.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
          category: 'Student Records',
          owner_id: student.student_id,
          status: 'processing',
        })
      }
    }
  },

  /**
   * Registers an employee, uploading metadata and any certificates/ID proofs
   */
  async submitEmployeeRegistration(employee: Partial<Employee>, files: File[] = []): Promise<void> {
    if (N8N_WEBHOOK_URL) {
      const formData = new FormData()
      formData.append('type', 'employee_registration')
      formData.append('metadata', JSON.stringify(employee))
      files.forEach((f, i) => {
        formData.append(`file_${i}`, f)
      })

      const response = await fetch(`${N8N_WEBHOOK_URL}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`n8n automation failed: ${response.statusText}`)
      }
      return
    }

    // Fallback: Direct Supabase insert
    const { error } = await supabase.from('employees').insert({
      employee_id: employee.employee_id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      status: employee.status,
      hire_date: employee.hire_date,
    })

    if (error) throw error

    // Upload files directly
    for (const f of files) {
      const filePath = `employees/${employee.employee_id}/${f.name}`
      const { error: uploadErr } = await supabase.storage
        .from('documents')
        .upload(filePath, f)
      if (uploadErr) {
        toast.error(`Failed to upload ${f.name}`)
      } else {
        await supabase.from('documents').insert({
          name: f.name,
          file_path: filePath,
          file_type: f.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
          category: 'Employee Records',
          owner_id: employee.employee_id,
          status: 'processing',
        })
      }
    }
  },

  /**
   * General document uploader via automation Webhook
   */
  async uploadDocument(file: File, category: string, onProgress?: (p: number) => void): Promise<void> {
    if (N8N_WEBHOOK_URL) {
      const formData = new FormData()
      formData.append('type', 'document_upload')
      formData.append('category', category)
      formData.append('file', file)

      const response = await fetch(`${N8N_WEBHOOK_URL}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`n8n automation failed: ${response.statusText}`)
      }
      onProgress?.(100)
      return
    }

    // Fallback: Direct Storage upload
    const filePath = `general/${category.toLowerCase().replace(/\s+/g, '_')}/${Date.now()}_${file.name}`
    
    // Simulate progression indicator for better visual feedback
    onProgress?.(20)
    const { error: uploadErr } = await supabase.storage
      .from('documents')
      .upload(filePath, file)
    
    if (uploadErr) throw uploadErr
    onProgress?.(80)

    // Insert metadata
    const { error: dbErr } = await supabase.from('documents').insert({
      name: file.name,
      file_path: filePath,
      file_type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      category,
      status: 'processing',
      file_size: file.size,
    })

    if (dbErr) throw dbErr
    onProgress?.(100)
  }
}
