import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Users, X, Mail, Loader2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery, useMutation } from '@tanstack/react-query'
import { studentService } from '@/services/studentService'
import { messageService } from '@/services/messageService'
import { cn } from '@/lib/utils'

export function ComposePage() {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)

  // Fetch active students
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students-active'],
    queryFn: studentService.getStudents,
  })

  const sendMutation = useMutation({
    mutationFn: (args: { subject: string; body: string; count: number }) =>
      messageService.sendMessage(args.subject, args.body, args.count),
    onSuccess: () => {
      toast.success('Message dispatched and logged successfully.')
      setSent(true)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to dispatch message.')
    }
  })

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const activeStudents = students.filter(s => s.status === 'active')
  const recipients = activeStudents.filter((s) => selectedStudents.includes(s.id))

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedStudents.length === 0) { toast.error('Please select at least one student.'); return }
    if (!subject.trim()) { toast.error('Please enter a subject.'); return }
    if (!body.trim()) { toast.error('Please enter a message body.'); return }

    sendMutation.mutate({
      subject,
      body,
      count: recipients.length
    })
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Parent Messaging</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Compose and send messages to parents</p>
      </div>

      {sent ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
          <p className="text-muted-foreground text-sm mb-6">Your message has been delivered to {recipients.length} parent(s).</p>
          <button onClick={() => { setSent(false); setSelectedStudents([]); setSubject(''); setBody('') }}
            className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
            Compose New
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Student Selector */}
          <div className="lg:col-span-1 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Select Students</h3>
              <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {selectedStudents.length} selected
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="p-3 text-center border border-red-200 bg-red-50 text-red-600 text-xs rounded-xl">
                <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
                Failed to load students.
              </div>
            ) : activeStudents.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No active students found.</p>
            ) : (
              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {activeStudents.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggleStudent(student.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all',
                      selectedStudents.includes(student.id)
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-muted border border-transparent'
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {student.full_name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{student.full_name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{student.parent_name}</p>
                    </div>
                    {selectedStudents.includes(student.id) && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Compose */}
          <form onSubmit={handleSend} className="lg:col-span-2 space-y-4">
            {/* Recipients Preview */}
            {recipients.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Recipients ({recipients.length})</p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {recipients.map((r) => (
                    <span key={r.id} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                      <Mail className="w-3 h-3" />
                      {r.parent_email}
                      <button type="button" onClick={() => toggleStudent(r.id)} className="text-muted-foreground hover:text-foreground ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject..."
                  required
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Message Body <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your message to parents here..."
                  rows={10}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{body.length} characters</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {recipients.length > 0
                  ? `Will send to ${recipients.length} parent(s)`
                  : 'Select students to add recipients'}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={sendMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
              >
                {sendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sendMutation.isPending ? 'Sending...' : 'Send Message'}
              </motion.button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
