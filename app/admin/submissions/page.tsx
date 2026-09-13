import { requireAdmin } from '@/lib/admin'
import SubmissionActions from './submission-actions'

export default async function AdminSubmissionsPage() {
  const { supabase, admin } = await requireAdmin()
  const { data, error } = await supabase.rpc('admin_task_submissions', { p_status: 'pending' })

  return (
    <main className="admin-page">
      <header><a href="/admin">← Admin</a><p>TASKAURA ADMIN</p><h1>Task Submissions</h1><span>Review pending proofs before rewards are credited.</span></header>
      {error ? <div className="panel error">Unable to load submissions.</div> : data?.length ? <section className="list">{data.map((item: any) => <article className="card" key={item.id}><div className="top"><span className="status">{item.status}</span><strong>₹{Number(item.reward ?? 0).toFixed(2)}</strong></div><h2>{item.task_name}</h2><p className="muted">User: {item.user_id}</p><p>{item.additional_proof || 'No additional note provided.'}</p>{item.proof_file && <p className="muted">Proof: {item.proof_file}</p>}<small>Submitted: {new Date(item.submitted_at).toLocaleString('en-IN')}</small><SubmissionActions submissionId={item.id} /> </article>)}</section> : <div className="panel"><h2>No pending submissions</h2><p>Everything is currently reviewed.</p></div>}
      <style>{`.admin-page{min-height:100vh;background:#07070a;color:#fff;padding:24px 16px 50px;max-width:900px;margin:auto}.admin-page header a{color:#aaa;text-decoration:none;font-size:13px}.admin-page header p{font-size:10px;letter-spacing:.2em;color:#888;margin:28px 0 5px}.admin-page h1{margin:0;font-size:28px}.admin-page header span,.muted{display:block;color:#999;font-size:13px;margin-top:7px}.list{display:grid;gap:12px;margin-top:24px}.card,.panel{border:1px solid #292933;background:#111117;border-radius:20px;padding:17px}.top{display:flex;justify-content:space-between}.status{font-size:10px;text-transform:uppercase;background:#24202f;color:#c8bdff;padding:6px 9px;border-radius:8px}.card h2{font-size:17px;margin:13px 0 7px}.card p{color:#aaa;font-size:13px;line-height:1.5}.card small{color:#777}.error{margin-top:24px;color:#ffaaa0}`}</style>
    </main>
  )
}
