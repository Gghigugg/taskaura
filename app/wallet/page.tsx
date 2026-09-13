import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WalletPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: wallet } = await supabase.from('wallets').select('available_balance, pending_balance, updated_at').eq('user_id', user.id).maybeSingle()
  return <main className="dashboard-shell"><section className="balance-card"><span>Available Balance</span><strong>₹{Number(wallet?.available_balance ?? 0).toFixed(2)}</strong><small>Pending: ₹{Number(wallet?.pending_balance ?? 0).toFixed(2)}</small></section></main>
}
