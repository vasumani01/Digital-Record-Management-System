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

  async sendMessage(subject: string, body: string, recipients: any[]): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser()

    // Get sender profile details
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user?.id)
      .single()

    const messagePayload = {
      subject,
      body,
      sender_id: user?.id,
      sender_name: profile?.full_name || 'Admin',
      recipient_count: recipients.length,
      status: 'sent',
      recipients: recipients.map((r) => ({
        student_id: r.student_id,
        student_name: r.full_name,
        parent_name: r.parent_name,
        parent_email: r.parent_email
      }))
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(messagePayload)
      .select()
      .single()

    if (error) throw error

    // Call n8n Parent Messaging Relay webhook
    try {
      await fetch('https://vasuoff.app.n8n.cloud/webhook-test/drms-send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: data.id,
          subject,
          body,
          recipients: messagePayload.recipients
        })
      })
    } catch (err) {
      console.warn('n8n Messaging Webhook relay offline or returned error:', err)
    }

    return data as Message
  }
}
