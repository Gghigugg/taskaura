import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'

const modules = [
  ['Users', '/admin/users', 'Manage accounts and activation'],
  ['Tasks', '/admin/tasks', 'Create and manage earning tasks'],
  ['Submissions', '/admin/submissions', 'Review proofs and approve rewards'],
  ['Withdrawals', '/admin/withdrawals', 'Review withdrawal requests'],
  ['Payments', '/admin/payments', 'Registration and activation payments'],
  ['Fraud & Risk', '/admin/fraud', 'Review risk flags and restrictions'],
  ['Support', '/admin/support', 'Handle support tickets'],
  ['Reports', '/admin/reports', 'Operational and financial reporting'],
  ['Settings', '/admin/settings', 'System and maintenance controls'],
  ['Audit Logs', '/admin/audit', 'Review administrative actions'],
]

export default async function AdminPage() {
  const { admin } = await requireAdmin()
  const supabase = await createClient()
  const [users, tasks, pending, withdrawals] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('task_submissions').select('id', { count: 'exact', head: true }).in('status', ['pending', 'manual_review']),
    supabase.from('withdrawals').select('id', { count: 'exact', head: true }).in('status', ['pending', 'processing']),
  ])

  const stats = [
    ['Users', users.count ?? 0],
    ['Active Tasks', tasks.count ?? 0],
    ['To Review', pending.count ?? 0],
    ['Withdrawals', withdrawals.count ?? 0],
  ]

  return <main className="admin-shell">
    <header className="hero"><div><p className="eyebrow">TASKAURA ADMIN</p><h1>Control Center</h1><p className="muted">Signed in as <strong>{admin.username}</strong> · {admin.role}</p></div><Link href="/dashboard" className="back">User Dashboard</Link></header>
    <section className="stats">{stats.map(([label, value]) => <div className="stat" key={String(label)}><span>{label}</span><strong>{String(value)}</strong></div>)}</section>
    <section className="grid">{modules.map(([name, href, description]) => <Link className="module" href={href} key={href}><strong>{name}</strong><span>{description}</span><b>→</b></Link>)}</section>
    <style>{`.admin-shell{min-height:100vh;background:#07070a;color:#fff;padding:24px 16px 56px;max-width:1100px;margin:auto}.hero{display:flex;justify-content:space-between;gap:20px;align-items:end;padding:18px 0 24px}.eyebrow{font-size:10px;letter-spacing:.22em;color:#888;margin:0 0 7px}.hero h1{font-size:32px;margin:0}.muted{color:#999;font-size:13px}.back{border:1px solid #30303a;border-radius:12px;padding:10px 13px;color:#fff;text-decoration:none;font-size:12px}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}.stat,.module{border:1px solid #292933;background:#111117;border-radius:18px}.stat{padding:15px}.stat span{display:block;color:#888;font-size:11px}.stat strong{display:block;font-size:25px;margin-top:6px}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.module{padding:18px;text-decoration:none;color:#fff;position:relative}.module strong{display:block;font-size:16px}.module span{display:block;color:#999;font-size:12px;margin-top:6px;padding-right:25px}.module b{position:absolute;right:17px;top:50%;transform:translateY(-50%);color:#aaa}@media(max-width:650px){.hero{align-items:flex-start;flex-direction:column}.stats{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}}`}</style>
  </main>
}