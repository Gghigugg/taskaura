import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SupportPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  const { data: tickets } = await supabase.from('support_tickets').select('id,category,subject,priority,status,created_at,updated_at').eq('user_id', user.id).order('created_at',{ascending:false}).limit(50)
  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Support</h1><p>Need help? Your support tickets are shown here.</p>{tickets?.length ? tickets.map(t=><article className="feature-card" key={t.id}><strong>{t.subject}</strong><p>{t.category} · {t.status} · {t.priority}</p></article>) : <p className="muted">No support tickets yet.</p>}</section></main>
}
