import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TransactionsPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  const { data } = await supabase.from('wallet_transactions').select('id,type,amount,balance_after,status,description,created_at').eq('user_id', user.id).order('created_at',{ascending:false}).limit(50)
  return <main className="dashboard-shell"><section className="feature-card"><h1>Transactions</h1>{data?.length ? data.map(t=><article className="feature-card" key={t.id}><strong>{t.type}</strong><p>₹{Number(t.amount??0).toFixed(2)} · {t.status}</p><small>{t.description ?? ''}</small></article>) : <p className="muted">No transactions yet.</p>}</section></main>
}
