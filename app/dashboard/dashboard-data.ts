import { createClient } from '@/lib/supabase/server'

export async function getDashboardData(userId: string) {
  const supabase = await createClient()

  const { data: account } = await supabase
    .from('users')
    .select('id, username, activation_status')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (!account) return null

  const [walletResult, tasksResult] = await Promise.all([
    supabase
      .from('wallets')
      .select('available_balance, pending_balance')
      .eq('user_id', account.id)
      .maybeSingle(),
    supabase
      .from('tasks')
      .select('id, name, reward, estimated_time, proof_required')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  return {
    account,
    wallet: walletResult.data ?? { available_balance: 0, pending_balance: 0 },
    tasks: tasksResult.data ?? [],
  }
}
