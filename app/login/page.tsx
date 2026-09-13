'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const email = `${username.trim().toLowerCase()}@login.taskora.local`
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Username या password गलत है।')
      setLoading(false)
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark">T</div>
        <p className="eyebrow">TASKORA</p>
        <h1>Welcome back</h1>
        <p className="muted">Login with your Taskora username.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Username<input value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" /></label>
          <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" /></label>
          {error && <p className="error">{error}</p>}
          <button disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
        </form>

        <p className="muted small">No account? Contact Taskora Admin for activation.</p>
        <a className="text-link" href="/contact">Contact Admin →</a>
      </section>
    </main>
  )
}
