import { supabase } from '@/lib/supabase'
import type { Message } from '@/types'

export const messageService = {
  async getMessages(): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('sent_at', { ascending: false })

    if (error) throw error
    return data as Message[]
  },

  async sendMessage(subject: string, body: string, recipientCount: number): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser()

    // Get sender profile details
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user?.id)
      .single()

    const { data, error } = await supabase
      .from('messages')
      .insert({
        subject,
        body,
        sender_id: user?.id,
        sender_name: profile?.full_name || 'Admin',
        recipient_count: recipientCount,
        status: 'sent'
      })
      .select()
      .single()

    if (error) throw error
    return data as Message
  }
}
