import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('display_name, username, created_at').eq('id', user.id).maybeSingle()

  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Profile</h1><p>Username: {profile?.username ?? '—'}</p><p>Name: {profile?.display_name ?? '—'}</p><p className="muted">Account profile information.</p></section></main>
}
