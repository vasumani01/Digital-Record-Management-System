import { supabase } from '@/lib/supabase'
import type { Student } from '@/types'

export const studentService = {
  async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Student[]
  },

  async getStudentById(id: string): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Student
  },

  async createStudent(student: Partial<Student>): Promise<Student> {
    // Exclude database auto-generated id field if empty string
    const payload = { ...student }
    if (!payload.id) delete payload.id

    const { data, error } = await supabase
      .from('students')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data as Student
  },

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update(student)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Student
  },

  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async archiveStudent(id: string): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update({ status: 'inactive' }) // Using 'inactive' or graduated based on policy
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Student
  }
}
