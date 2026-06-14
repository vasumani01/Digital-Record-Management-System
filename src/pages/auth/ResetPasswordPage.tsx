import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showP, setShowP] = useState(false)
  const [showC, setShowC] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setDone(true)
    setTimeout(() => navigate('/login'), 2000)
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Password reset!</h2>
        <p className="text-slate-400 text-sm">Redirecting you to login...</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to login
      </Link>
      <h2 className="text-2xl font-bold text-white mb-1">Reset password</h2>
      <p className="text-slate-400 text-sm mb-6">Choose a new secure password.</p>
      {error && <p className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-xl">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'New Password', value: password, set: setPassword, show: showP, setShow: setShowP },
          { label: 'Confirm Password', value: confirm, set: setConfirm, show: showC, setShow: setShowC },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">{field.label}</label>
            <div className="relative">
              <input
                type={field.show ? 'text' : 'password'}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                required
                className="w-full px-4 py-2.5 pr-10 bg-white/10 border border-white/20 rounded-xl text-white
                           placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2
                           focus:ring-blue-500/50 focus:border-blue-400 transition-all"
              />
              <button type="button" onClick={() => field.setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
        <button type="submit" disabled={loading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold disabled:opacity-60">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </motion.div>
  )
}
