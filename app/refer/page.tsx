import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ReferPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  const { data: referrals } = await supabase.from('referrals').select('id,referred_user_id,status,qualified_at,reward_amount,created_at').eq('referrer_id', user.id).order('created_at',{ascending:false}).limit(50)
  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Refer & Earn</h1><p>Invite eligible users and receive rewards according to the active referral rules.</p><p className="muted">Referral rewards are credited only after server-side eligibility checks.</p><p>Total referrals: {referrals?.length ?? 0}</p></section></main>
}
