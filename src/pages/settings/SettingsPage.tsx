import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Palette, Bell, Shield, Settings, Eye, EyeOff, Save, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'roles', label: 'Role Management', icon: Shield, adminOnly: true },
  { id: 'system', label: 'System', icon: Settings, adminOnly: true },
] as const

type TabId = typeof tabs[number]['id']

function ProfileTab() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    toast.success('Profile updated!')
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-lg">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
          {getInitials(user?.full_name || 'U')}
        </div>
        <div>
          <p className="font-semibold">{user?.full_name}</p>
          <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
          <button type="button" className="text-xs text-primary mt-1 hover:underline">Change avatar</button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      <button type="submit" disabled={saving}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60">
        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

function PasswordTab() {
  const [form, setForm] = useState({ current: '', new: '', confirm: '' })
  const [show, setShow] = useState({ current: false, new: false, confirm: false })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.new !== form.confirm) { toast.error('Passwords do not match.'); return }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    setForm({ current: '', new: '', confirm: '' })
    toast.success('Password updated!')
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-md">
      {(['current', 'new', 'confirm'] as const).map((field) => (
        <div key={field}>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 capitalize">
            {field === 'confirm' ? 'Confirm New Password' : `${field.charAt(0).toUpperCase() + field.slice(1)} Password`}
          </label>
          <div className="relative">
            <input
              type={show[field] ? 'text' : 'password'}
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              required
              className="w-full px-3 py-2.5 pr-10 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button type="button" onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ))}
      <button type="submit" disabled={saving}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60">
        <Lock className="w-4 h-4" /> {saving ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  )
}

function ThemeTab() {
  const { theme, setTheme } = useTheme()
  const options = [
    { id: 'light' as const, label: 'Light', desc: 'Clean white background', preview: 'bg-white border-slate-200' },
    { id: 'dark' as const, label: 'Dark', desc: 'Dark background, easy on eyes', preview: 'bg-slate-900 border-slate-700' },
    { id: 'system' as const, label: 'System', desc: 'Follow your OS preference', preview: 'bg-gradient-to-r from-white to-slate-900 border-slate-400' },
  ]

  return (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-muted-foreground">Choose your preferred color theme.</p>
      <div className="space-y-3">
        {options.map((opt) => (
          <button key={opt.id} onClick={() => setTheme(opt.id)}
            className={cn('w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
              theme === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80')}>
            <div className={cn('w-12 h-8 rounded-lg border', opt.preview)} />
            <div className="flex-1">
              <p className="font-medium text-sm">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </div>
            {theme === opt.id && <Check className="w-4 h-4 text-primary" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    cert_expiry: true,
    ocr_complete: true,
    new_upload: true,
    message_sent: false,
    failed_workflow: true,
  })

  const options = [
    { key: 'cert_expiry', label: 'Certification Expiry Alerts', desc: 'Get notified when certifications are expiring' },
    { key: 'ocr_complete', label: 'OCR Processing Complete', desc: 'Notification when OCR indexing finishes' },
    { key: 'new_upload', label: 'New Document Uploads', desc: 'Alert when new documents are uploaded' },
    { key: 'message_sent', label: 'Message Delivery', desc: 'Confirmation when messages are delivered' },
    { key: 'failed_workflow', label: 'Failed Workflow Alerts', desc: 'Critical alerts for failed operations' },
  ]

  return (
    <div className="space-y-4 max-w-lg">
      {options.map((opt) => (
        <div key={opt.key} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
          <div>
            <p className="text-sm font-medium">{opt.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
          </div>
          <button
            onClick={() => setPrefs((p) => ({ ...p, [opt.key]: !p[opt.key as keyof typeof p] }))}
            className={cn('relative w-10 h-5 rounded-full transition-colors duration-200',
              prefs[opt.key as keyof typeof prefs] ? 'bg-primary' : 'bg-muted-foreground/30'
            )}
          >
            <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200',
              prefs[opt.key as keyof typeof prefs] ? 'left-5' : 'left-0.5'
            )} />
          </button>
        </div>
      ))}
      <button onClick={() => toast.success('Preferences saved!')}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
        <Save className="w-4 h-4" /> Save Preferences
      </button>
    </div>
  )
}

function RolesTab() {
  const roles = [
    { name: 'Admin', desc: 'Full system access — all modules', count: 1, color: 'badge-danger' },
    { name: 'Teacher', desc: 'Students, Documents, OCR Search, Messaging', count: 5, color: 'badge-info' },
  ]
  return (
    <div className="space-y-4 max-w-lg">
      {roles.map((role) => (
        <div key={role.name} className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={cn('badge', role.color)}>{role.name}</span>
              <span className="text-xs text-muted-foreground">{role.count} user{role.count !== 1 ? 's' : ''}</span>
            </div>
            <button className="text-xs text-primary hover:underline">Manage</button>
          </div>
          <p className="text-xs text-muted-foreground">{role.desc}</p>
        </div>
      ))}
    </div>
  )
}

function SystemTab() {
  return (
    <div className="space-y-4 max-w-lg">
      {[
        { label: 'System Version', value: '1.0.0' },
        { label: 'Database', value: 'Supabase (Not connected)' },
        { label: 'Storage', value: 'Local (Mock)' },
        { label: 'OCR Engine', value: 'Tesseract (Mock)' },
        { label: 'Last Backup', value: 'Never' },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="text-sm font-medium">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const { hasRole } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>('profile')

  const visibleTabs = tabs.filter((t) => !('adminOnly' in t && t.adminOnly) || hasRole('admin'))

  const content: Record<TabId, React.ReactNode> = {
    profile: <ProfileTab />,
    password: <PasswordTab />,
    theme: <ThemeTab />,
    notifications: <NotificationsTab />,
    roles: <RolesTab />,
    system: <SystemTab />,
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your account and system preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {visibleTabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all',
                  activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-xl border border-border bg-card p-6">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
            {content[activeTab]}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
