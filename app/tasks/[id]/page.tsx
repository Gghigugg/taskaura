import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { id } = await params

  const { data: task } = await supabase
    .from('tasks')
    .select('id, name, description, category, reward, estimated_time, proof_required, deadline, terms, instructions, status')
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle()

  if (!task) notFound()

  return (
    <main className="detail-page">
      <Link href="/tasks" className="back">← All Tasks</Link>
      <div className="hero"><span>{task.category || 'Task'}</span><h1>{task.name}</h1><strong>₹{Number(task.reward ?? 0).toFixed(2)}</strong><p>{task.description || 'Complete this task according to the instructions below.'}</p></div>
      <section className="info-grid"><div><small>Estimated time</small><b>{task.estimated_time || 'Flexible'}</b></div><div><small>Proof</small><b>{task.proof_required ? 'Required' : 'Not required'}</b></div>{task.deadline && <div><small>Deadline</small><b>{new Date(task.deadline).toLocaleString('en-IN')}</b></div>}</section>
      <section className="panel"><h2>Instructions</h2><p>{task.instructions || 'Follow the task requirements carefully. Do not submit false or manipulated proof.'}</p></section>
      {task.terms && <section className="panel"><h2>Terms</h2><p>{task.terms}</p></section>}
      <Link href={`/tasks/${task.id}/submit`} className="start">Start Task & Submit Proof →</Link>
      <style>{`.detail-page{min-height:100vh;background:#07070a;color:#fff;padding:24px 16px 50px;max-width:760px;margin:auto}.back{color:#aaa;text-decoration:none;font-size:13px}.hero{border:1px solid #292933;background:linear-gradient(145deg,#171720,#0f0f14);border-radius:24px;padding:23px;margin-top:22px}.hero>span{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#b9adff}.hero h1{font-size:27px;margin:12px 0}.hero strong{font-size:31px}.hero p{color:#aaa;font-size:13px;line-height:1.6}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.info-grid div,.panel{border:1px solid #272731;background:#111117;border-radius:17px;padding:15px}.info-grid small{display:block;color:#888;font-size:10px;margin-bottom:7px}.info-grid b{font-size:13px}.panel{margin-top:10px}.panel h2{font-size:16px;margin:0 0 8px}.panel p{color:#a5a5af;font-size:13px;line-height:1.65;white-space:pre-wrap}.start{display:block;text-align:center;background:#fff;color:#08080a;text-decoration:none;font-weight:800;padding:13px;border-radius:13px;margin-top:16px;font-size:13px}`}</style>
    </main>
  )
}
