import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WithdrawPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  const { data: wallet } = await supabase.from('wallets').select('available_balance').eq('user_id', user.id).maybeSingle()
  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Withdraw</h1><p>Available balance: ₹{Number(wallet?.available_balance ?? 0).toFixed(2)}</p><p className="muted">Minimum withdrawal and fees are controlled by TaskAura settings.</p><p>Withdrawal requests will be submitted only through a protected server-side transaction flow. No balance is changed by this page.</p><a href="/withdrawals">View withdrawal history</a></section></main>
}
