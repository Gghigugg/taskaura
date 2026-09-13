import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WithdrawForm from './withdraw-form'

export default async function WithdrawPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  const { data: wallet } = await supabase.from('wallets').select('available_balance').eq('user_id', user.id).maybeSingle()
  const balance = Number(wallet?.available_balance ?? 0)
  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Withdraw</h1><p>Available balance: ₹{balance.toFixed(2)}</p><p className="muted">Minimum withdrawal: ₹100. Requests are protected and processed by the server.</p><WithdrawForm balance={balance}/><a href="/withdrawals">View withdrawal history</a></section></main>
}
