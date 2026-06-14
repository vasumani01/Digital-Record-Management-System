import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('admin@drms.edu')
  const [password, setPassword] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
      <p className="text-slate-400 text-sm mb-6">Sign in to your DRMS account</p>

      {/* Demo Credentials Info */}
      <div className="mb-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-blue-300 text-xs font-medium mb-1">Demo Credentials</p>
        <p className="text-slate-300 text-xs">Admin: <code className="text-blue-300">admin@drms.edu</code></p>
        <p className="text-slate-300 text-xs">Teacher: <code className="text-blue-300">teacher@drms.edu</code></p>
        <p className="text-slate-400 text-xs mt-1">Any password works</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@drms.edu"
            required
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white
                       placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2
                       focus:ring-blue-500/50 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 pr-10 bg-white/10 border border-white/20 rounded-xl text-white
                         placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2
                         focus:ring-blue-500/50 focus:border-blue-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me + Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500"
            />
            <span className="text-sm text-slate-300">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                     bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
                     text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/25
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {isLoading ? 'Signing in...' : 'Sign In'}
        </motion.button>
      </form>
    </motion.div>
  )
}
