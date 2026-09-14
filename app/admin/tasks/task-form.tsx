'use client'

import { useState } from 'react'

const STATUSES = ['draft','active','paused','completed','expired','archived']

type Task = {
  id?: string
  name?: string
  category?: string
  description?: string | null
  task_link?: string | null
  reward?: number
  estimated_minutes?: number | null
  proof_required?: boolean
  proof_requirements?: string | null
  deadline?: string | null
  status?: string
}

function toLocalValue(value?: string | null) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n:number) => String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function TaskForm({ task }: { task?: Task }) {
  const [form, setForm] = useState({
    name: task?.name || '', category: task?.category || '', description: task?.description || '',
    taskLink: task?.task_link || '', reward: String(task?.reward ?? ''),
    estimatedMinutes: task?.estimated_minutes ? String(task.estimated_minutes) : '',
    proofRequired: task?.proof_required ?? true, proofRequirements: task?.proof_requirements || '',
    deadline: toLocalValue(task?.deadline), status: task?.status || 'draft'
  })
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState('')
  const set=(key:string,value:any)=>setForm(f=>({...f,[key]:value}))

  async function submit(e:React.FormEvent){
    e.preventDefault(); setBusy(true); setMessage('')
    try {
      const res=await fetch('/api/admin/tasks',{method:task?.id?'PATCH':'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...form,id:task?.id})})
      const data=await res.json()
      if(!res.ok) throw new Error(data.error||'Unable to save task.')
      setMessage('Task saved successfully.')
      if(!task?.id) window.location.href=`/admin/tasks/${data.task.id}/edit`
    } catch(err:any){ setMessage(err.message) } finally { setBusy(false) }
  }

  return <form onSubmit={submit} className="form">
    <label>Task name<input value={form.name} onChange={e=>set('name',e.target.value)} required maxLength={160}/></label>
    <label>Category<input value={form.category} onChange={e=>set('category',e.target.value)} required maxLength={80}/></label>
    <label>Description<textarea value={form.description} onChange={e=>set('description',e.target.value)} maxLength={5000}/></label>
    <label>Task link<input type="url" placeholder="https://..." value={form.taskLink} onChange={e=>set('taskLink',e.target.value)}/></label>
    <div className="grid"><label>Reward (₹)<input type="number" min="0" step="0.01" value={form.reward} onChange={e=>set('reward',e.target.value)} required/></label><label>Estimated minutes<input type="number" min="1" step="1" value={form.estimatedMinutes} onChange={e=>set('estimatedMinutes',e.target.value)}/></label></div>
    <label className="check"><input type="checkbox" checked={form.proofRequired} onChange={e=>set('proofRequired',e.target.checked)}/> Proof required</label>
    {form.proofRequired && <label>Proof requirements<textarea value={form.proofRequirements} onChange={e=>set('proofRequirements',e.target.value)} maxLength={3000} required/></label>}
    <div className="grid"><label>Deadline<input type="datetime-local" value={form.deadline} onChange={e=>set('deadline',e.target.value)}/></label><label>Status<select value={form.status} onChange={e=>set('status',e.target.value)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></label></div>
    <button disabled={busy}>{busy?'Saving…':task?.id?'Save changes':'Create task'}</button>
    {message && <p className="msg">{message}</p>}
    <style>{`.form{display:grid;gap:14px;margin-top:24px}.form label{display:grid;gap:7px;color:#bbb;font-size:12px}.form input,.form textarea,.form select{width:100%;box-sizing:border-box;background:#0d0d12;color:#fff;border:1px solid #292933;border-radius:12px;padding:12px;font:inherit}.form textarea{min-height:100px;resize:vertical}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.check{display:flex!important;align-items:center;grid-template-columns:auto 1fr!important}.check input{width:auto}.form button{border:0;border-radius:12px;padding:13px 16px;background:#fff;color:#09090b;font-weight:700}.form button:disabled{opacity:.55}.msg{margin:0;color:#9ca3af;font-size:12px}@media(max-width:600px){.grid{grid-template-columns:1fr}}`}</style>
  </form>
}
