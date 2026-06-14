import { supabase } from '@/lib/supabase'
import type { AuditLog } from '@/types'

export const auditService = {
  async getAuditLogs(): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as AuditLog[]
  },

  async logAction(action: string, module: string, details: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      let ip = '127.0.0.1'
      try {
        const res = await fetch('https://api.ipify.org?format=json')
        const ipData = await res.json()
        ip = ipData.ip || '127.0.0.1'
      } catch {
        // ignore fallback
      }

      await supabase.from('audit_logs').insert({
        user_id: user.id,
        user_name: profile?.full_name || user.email || 'System',
        action,
        module,
        details,
        ip_address: ip
      })
    } catch (err) {
      console.warn('Logging action failed:', err)
    }
  }
}
