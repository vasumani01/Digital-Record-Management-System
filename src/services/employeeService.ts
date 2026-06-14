import { supabase } from '@/lib/supabase'
import type { Employee } from '@/types'

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Employee[]
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Employee
  },

  async createEmployee(employee: Partial<Employee>): Promise<Employee> {
    const payload = { ...employee }
    if (!payload.id) delete payload.id

    const { data, error } = await supabase
      .from('employees')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data as Employee
  },

  async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .update(employee)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Employee
  },

  async deleteEmployee(id: string): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
