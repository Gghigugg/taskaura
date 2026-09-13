import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CheckInPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  const { data: history } = await supabase.from('daily_checkins').select('checkin_date,streak_number,reward_amount').eq('user_id', user.id).order('checkin_date',{ascending:false}).limit(10)
  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Daily Check-in</h1><p>Keep your daily streak and earn configured rewards.</p><p className="muted">Check-in rewards are processed server-side.</p>{history?.length ? history.map(x=><article className="feature-card" key={x.checkin_date}><strong>{x.checkin_date}</strong><p>Streak: {x.streak_number} · Reward: ₹{Number(x.reward_amount??0).toFixed(2)}</p></article>) : <p className="muted">No check-ins yet.</p>}</section></main>
}
