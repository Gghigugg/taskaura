import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await request.formData()
  const taskId = String(form.get('taskId') || '')
  const note = String(form.get('note') || '').trim()
  const file = form.get('proof')
  if (!taskId) return NextResponse.json({ error: 'Task is required.' }, { status: 400 })
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: 'Proof file is required.' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File must be 8 MB or smaller.' }, { status: 400 })
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: 'Unsupported proof file type.' }, { status: 400 })

  const { data: account } = await supabase.from('users').select('id').eq('auth_user_id', authUser.id).maybeSingle()
  if (!account) return NextResponse.json({ error: 'Account not found.' }, { status: 404 })

  const { data: task } = await supabase.from('tasks').select('id,proof_required,status,deadline').eq('id', taskId).eq('status', 'active').maybeSingle()
  if (!task) return NextResponse.json({ error: 'Task is no longer available.' }, { status: 404 })
  if (task.deadline && new Date(task.deadline).getTime() < Date.now()) return NextResponse.json({ error: 'Task deadline has passed.' }, { status: 400 })

  const { data: existing } = await supabase.from('task_submissions').select('id,status').eq('task_id', taskId).eq('user_id', account.id).in('status', ['pending','approved','manual_review']).limit(1)
  if (existing?.length) return NextResponse.json({ error: 'You already have a submission for this task.' }, { status: 409 })

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120)
  const path = `${authUser.id}/${taskId}/${crypto.randomUUID()}-${safeName}`
  const bytes = new Uint8Array(await file.arrayBuffer())
  const { error: uploadError } = await supabase.storage.from('task-proofs').upload(path, bytes, { contentType: file.type, upsert: false })
  if (uploadError) return NextResponse.json({ error: 'Proof upload failed.' }, { status: 500 })

  const { data: submission, error: insertError } = await supabase.from('task_submissions').insert({
    task_id: taskId,
    user_id: account.id,
    proof_file: path,
    additional_proof: note || null,
    status: 'pending'
  }).select('id,status,submitted_at').single()

  if (insertError) {
    await supabase.storage.from('task-proofs').remove([path])
    return NextResponse.json({ error: 'Could not create submission.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, submission })
}
