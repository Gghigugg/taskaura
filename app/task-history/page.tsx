import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TaskHistoryPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  const { data } = await supabase.from('task_submissions').select('id,task_id,status,submitted_at,rejection_reason,reviewed_at').eq('user_id', user.id).order('submitted_at',{ascending:false}).limit(100)
  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Task History</h1>{data?.length ? data.map(s=><article className="feature-card" key={s.id}><strong>{s.status}</strong><p>Task: {s.task_id}</p><small>{s.rejection_reason ?? `Submitted ${new Date(s.submitted_at).toLocaleString()}`}</small></article>) : <p className="muted">No task submissions yet.</p>}</section></main>
}
