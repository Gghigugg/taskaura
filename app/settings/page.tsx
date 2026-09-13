import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Settings</h1><p>Account and application settings will be managed here.</p></section></main>
}
