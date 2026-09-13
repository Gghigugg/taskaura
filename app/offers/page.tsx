import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OffersPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login')
  const { data: offers } = await supabase.from('partner_offers').select('id,partner_name,title,description,official_url,reward,requirements,eligibility,start_at,end_at,status').eq('status','active').order('created_at',{ascending:false}).limit(50)
  return <main className="dashboard-shell"><section className="feature-card"><p className="eyebrow">TASKAURA</p><h1>Partner Offers</h1>{offers?.length ? offers.map(o=><article className="feature-card" key={o.id}><h2>{o.title}</h2><p>{o.description}</p><p>Reward: ₹{Number(o.reward??0).toFixed(2)}</p>{o.official_url && <a href={o.official_url} target="_blank" rel="noreferrer">Open official offer</a>}</article>) : <p className="muted">No active offers available.</p>}</section></main>
}
