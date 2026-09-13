import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SubmitTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { id } = await params
  const { data: task } = await supabase.from('tasks').select('id,name,reward,proof_required,proof_requirements,task_link,status').eq('id', id).eq('status','active').maybeSingle()
  if (!task) notFound()

  return (
    <main className="submit-page">
      <Link href={`/tasks/${task.id}`} className="back">← Back to Task</Link>
      <div className="head"><span>SUBMIT PROOF</span><h1>{task.name}</h1><b>Reward: ₹{Number(task.reward ?? 0).toFixed(2)}</b></div>
      {task.task_link && <a href={task.task_link} target="_blank" rel="noreferrer" className="task-link">Open Task Link ↗</a>}
      <form action="#" className="form">
        <label>Proof screenshot / file <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" required={task.proof_required} /></label>
        {task.proof_requirements && <div className="requirements"><strong>Proof requirements</strong><p>{task.proof_requirements}</p></div>}
        <label>Additional proof or note <textarea placeholder="Add any useful details (optional)" /></label>
        <button type="submit" disabled>Submit Proof</button>
        <small>Secure submission will be enabled with server-side upload and verification in the next backend step. Never upload passwords, OTPs, or sensitive financial credentials.</small>
      </form>
      <style>{`.submit-page{min-height:100vh;background:#07070a;color:#fff;padding:24px 16px 50px;max-width:700px;margin:auto}.back{color:#aaa;text-decoration:none;font-size:13px}.head{margin-top:24px;border:1px solid #292933;background:#111117;border-radius:22px;padding:20px}.head span{font-size:10px;letter-spacing:.12em;color:#aaa}.head h1{font-size:24px;margin:10px 0}.head b{font-size:18px}.task-link{display:block;text-align:center;margin:12px 0;background:#1b1b24;color:#fff;text-decoration:none;padding:12px;border-radius:12px;font-size:13px}.form{border:1px solid #292933;background:#111117;border-radius:22px;padding:18px;margin-top:12px}.form label{display:block;color:#ccc;font-size:12px;font-weight:700;margin-bottom:16px}.form input,.form textarea{display:block;width:100%;box-sizing:border-box;margin-top:8px;background:#0a0a0e;color:#fff;border:1px solid #30303a;border-radius:11px;padding:11px;font:inherit}.form textarea{min-height:100px;resize:vertical}.requirements{background:#19191f;border-radius:12px;padding:12px;margin-bottom:16px}.requirements strong{font-size:12px}.requirements p{font-size:12px;color:#aaa;line-height:1.5;white-space:pre-wrap}.form button{width:100%;border:0;border-radius:12px;padding:13px;font-weight:800;background:#444;color:#999;cursor:not-allowed}.form small{display:block;color:#777;font-size:10px;line-height:1.5;margin-top:10px}`}</style>
    </main>
  )
}
