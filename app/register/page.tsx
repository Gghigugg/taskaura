'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const supabase = createClient()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (username.trim().length < 4 || password.length < 8) {
      setError('Username कम से कम 4 characters और password कम से कम 8 characters का होना चाहिए।')
      setLoading(false)
      return
    }

    const email = `${username.trim().toLowerCase()}@login.taskora.local`
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username.trim().toLowerCase(), full_name: name.trim() } },
    })

    if (error) {
      setError(error.message.includes('already') ? 'यह username पहले से मौजूद है।' : 'Account activation अभी पूरा नहीं हो सका।')
      setLoading(false)
      return
    }

    setMessage('Account तैयार है। अब Login करके Taskora शुरू करें।')
    setLoading(false)
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark">T</div>
        <p className="eyebrow">TASKORA</p>
        <h1>Create account</h1>
        <p className="muted">Activation fee और account creation policy के अनुसार account activate करें.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full name<input value={name} onChange={e => setName(e.target.value)} required /></label>
          <label>Username<input value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" /></label>
          <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" /></label>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <button disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
        </form>

        <p className="muted small">Already activated?</p>
        <a className="text-link" href="/login">Go to Login →</a>
      </section>
    </main>
  )
}
