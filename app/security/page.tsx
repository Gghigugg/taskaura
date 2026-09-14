import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PasswordForm from './password-form'

export default async function SecurityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Security</h1><p>Your account uses secure Supabase authentication. Existing passwords are never displayed or stored in plaintext.</p></section><PasswordForm/></main>
}
