import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SecurityPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Security</h1><p>Your account uses secure Supabase authentication. Password changes and recovery should be completed through the supported account-security flow.</p><p className="muted">TaskAura does not display or store your existing plaintext password.</p></section></main>
}
