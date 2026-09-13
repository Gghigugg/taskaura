import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, name, description, category, reward, estimated_time, proof_required, deadline, status')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  return (
    <main className="tasks-page">
      <header><Link href="/dashboard">← Dashboard</Link><p>TASKORA</p><h1>Available Tasks</h1><span>Complete verified tasks and earn rewards.</span></header>
      <section className="task-list">
        {tasks?.length ? tasks.map((task) => (
          <article className="task-card" key={task.id}>
            <div className="task-top"><span className="category">{task.category || 'Task'}</span><strong>₹{Number(task.reward ?? 0).toFixed(2)}</strong></div>
            <h2>{task.name}</h2>
            <p>{task.description || 'Follow the task instructions and submit the required proof.'}</p>
            <div className="meta"><span>⏱ {task.estimated_time || 'Flexible'}</span><span>🧾 {task.proof_required ? 'Proof required' : 'No proof'}</span></div>
            <Link href={`/tasks/${task.id}`}>View Task →</Link>
          </article>
        )) : <div className="empty"><div>✨</div><h2>No tasks available</h2><p>New tasks will appear here when they are activated.</p></div>}
      </section>
      <style>{`
        .tasks-page{min-height:100vh;background:#07070a;color:#fff;padding:22px 16px 40px;max-width:850px;margin:auto}.tasks-page header a{color:#aaa;text-decoration:none;font-size:13px}.tasks-page header p{font-size:10px;letter-spacing:.2em;color:#888;margin:28px 0 5px}.tasks-page h1{margin:0;font-size:28px}.tasks-page header span{display:block;color:#999;font-size:13px;margin-top:7px}.task-list{display:grid;gap:12px;margin-top:24px}.task-card,.empty{border:1px solid #282832;background:#111117;border-radius:20px;padding:17px}.task-top{display:flex;justify-content:space-between;align-items:center}.task-top strong{font-size:21px}.category{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#b9adff;background:#1d1a2a;padding:6px 9px;border-radius:8px}.task-card h2{font-size:17px;margin:14px 0 7px}.task-card p{color:#a5a5b0;font-size:13px;line-height:1.5;margin:0}.meta{display:flex;gap:14px;color:#888;font-size:11px;margin:13px 0}.task-card>a{display:block;text-align:center;text-decoration:none;color:#fff;background:#1d1d26;border-radius:11px;padding:11px;font-size:12px;font-weight:700}.empty{text-align:center;padding:45px 20px}.empty div{font-size:35px}.empty h2{font-size:18px;margin:10px 0}.empty p{color:#999;font-size:13px}@media(min-width:700px){.tasks-page{padding:40px 25px}.task-list{grid-template-columns:1fr 1fr}}
      `}</style>
    </main>
  )
}
