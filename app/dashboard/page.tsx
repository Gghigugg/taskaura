import { getDashboardData } from './dashboard-data'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const data = await getDashboardData(user.id)
  if (!data) redirect('/login')

  const balance = Number(data.wallet.available_balance ?? 0)
  const pending = Number(data.wallet.pending_balance ?? 0)

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">TASKORA</p>
          <h1>Welcome, {data.account.username} 👋</h1>
          <p className="muted">Complete. Earn. Reward.</p>
        </div>
        <div className="balance-card">
          <span>Available Balance</span>
          <strong>₹{balance.toFixed(2)}</strong>
          <small>Pending: ₹{pending.toFixed(2)}</small>
        </div>
      </section>

      <section className="dashboard-grid">
        {data.tasks.map((task) => (
          <a href={`/tasks/${task.id}`} className="feature-card" key={task.id}>
            <span>📋</span>
            <h2>{task.name}</h2>
            <p>Reward: ₹{Number(task.reward ?? 0).toFixed(2)}</p>
            <p>{task.estimated_time ?? 'Flexible'} · {task.proof_required ? 'Proof required' : 'No proof required'}</p>
          </a>
        ))}
        {!data.tasks.length && <div className="feature-card"><span>✨</span><h2>No active tasks</h2><p>New tasks will appear here when available.</p></div>}
        <a href="/check-in" className="feature-card"><span>📅</span><h2>Daily Check-in</h2><p>Maintain your streak and collect rewards.</p></a>
        <a href="/wallet" className="feature-card"><span>💰</span><h2>Wallet</h2><p>View balance and transaction history.</p></a>
        <a href="/withdraw" className="feature-card"><span>💸</span><h2>Withdraw</h2><p>Request eligible withdrawals securely.</p></a>
      </section>

      <footer className="dashboard-footer">Account status: {data.account.activation_status ?? 'active'}</footer>
    </main>
  )
}
