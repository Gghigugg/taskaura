import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WithdrawalsPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  const { data } = await supabase.from('withdrawals').select('id,requested_amount,fee,net_amount,method,status,rejection_reason,requested_at').eq('user_id', user.id).order('requested_at',{ascending:false}).limit(50)
  return <main className="dashboard-shell"><section className="feature-card"><h1>Withdrawal History</h1>{data?.length ? data.map(w=><article className="feature-card" key={w.id}><strong>₹{Number(w.requested_amount??0).toFixed(2)}</strong><p>{w.method} · {w.status}</p><small>{w.rejection_reason ?? ''}</small></article>) : <p className="muted">No withdrawal requests yet.</p>}</section></main>
}
