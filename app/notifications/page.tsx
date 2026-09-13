import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function NotificationsPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  const { data } = await supabase.from('notifications').select('id,type,title,message,read_at,created_at').eq('user_id', user.id).order('created_at',{ascending:false}).limit(50)
  return <main className="dashboard-shell"><section className="feature-card"><h1>Notifications</h1>{data?.length ? data.map(n=><article className="feature-card" key={n.id}><strong>{n.title}</strong><p>{n.message}</p><small>{n.read_at ? 'Read' : 'Unread'}</small></article>) : <p className="muted">No notifications.</p>}</section></main>
}
