import { supabase } from '@/lib/supabase'
import type { Certification } from '@/types'

export const certificationService = {
  async getCertifications(employeeId?: string): Promise<Certification[]> {
    let query = supabase
      .from('certifications')
      .select('*')
      .order('expiry_date', { ascending: true })

    if (employeeId) {
      query = query.eq('employee_id', employeeId)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Certification[]
  },

  async createCertification(certification: Partial<Certification>): Promise<Certification> {
    const { data, error } = await supabase
      .from('certifications')
      .insert(certification)
      .select()
      .single()

    if (error) throw error
    return data as Certification
  },

  async updateCertification(id: string, certification: Partial<Certification>): Promise<Certification> {
    const { data, error } = await supabase
      .from('certifications')
      .update(certification)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Certification
  },

  async deleteCertification(id: string): Promise<void> {
    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
