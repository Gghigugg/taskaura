import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TaskHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('task_submissions')
    .select('id,task_id,status,submitted_at,rejection_reason,reviewed_at, tasks(name,reward,category)')
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false })
    .limit(100)

  const statusLabel: Record<string, string> = { approved: 'Approved', rejected: 'Rejected', pending: 'Pending', manual_review: 'Manual Review' }

  return (
    <main className="dashboard-shell">
      <section className="feature-card">
        <p className="eyebrow">TASKAURA</p>
        <h1>Task History</h1>
        <p className="muted">Track your submitted tasks, review status and rewards.</p>
        <div style={{ display: 'grid', gap: 14, marginTop: 20 }}>
          {data?.length ? data.map((submission: any) => {
            const task = Array.isArray(submission.tasks) ? submission.tasks[0] : submission.tasks
            return (
              <article className="feature-card" key={submission.id} style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <strong>{task?.name ?? `Task #${submission.task_id.slice(0, 8)}`}</strong>
                    <p className="muted" style={{ margin: '5px 0 0' }}>{task?.category ?? 'Task'} · Reward ₹{task?.reward ?? 0}</p>
                  </div>
                  <strong>{statusLabel[submission.status] ?? submission.status}</strong>
                </div>
                <small>Submitted: {new Date(submission.submitted_at).toLocaleString()}</small>
                {submission.reviewed_at && <small style={{ display: 'block' }}>Reviewed: {new Date(submission.reviewed_at).toLocaleString()}</small>}
                {submission.rejection_reason && <p style={{ marginBottom: 0 }}><strong>Reason:</strong> {submission.rejection_reason}</p>}
              </article>
            )
          }) : <p className="muted">No task submissions yet.</p>}
        </div>
      </section>
    </main>
  )
}
