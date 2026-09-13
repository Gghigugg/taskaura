import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: account } = await supabase
    .from('users')
    .select('username, activation_status, must_change_password')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">TASKORA</p>
          <h1>Welcome, {account?.username ?? 'User'} 👋</h1>
          <p className="muted">Complete. Earn. Reward.</p>
        </div>
        <div className="balance-card">
          <span>Available Balance</span>
          <strong>₹0.00</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <a href="/tasks" className="feature-card"><span>📋</span><h2>Tasks</h2><p>Complete verified tasks and earn rewards.</p></a>
        <a href="/check-in" className="feature-card"><span>📅</span><h2>Daily Check-in</h2><p>Maintain your streak and collect rewards.</p></a>
        <a href="/wallet" className="feature-card"><span>💰</span><h2>Wallet</h2><p>View balance and transaction history.</p></a>
        <a href="/withdraw" className="feature-card"><span>💸</span><h2>Withdraw</h2><p>Request eligible withdrawals securely.</p></a>
      </section>

      <footer className="dashboard-footer">Account status: {account?.activation_status ?? 'active'}</footer>
    </main>
  )
}
