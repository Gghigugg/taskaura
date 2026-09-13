import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ROLES = new Set(['Super Admin','Task Manager','Verification Manager'])

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: admin } = await supabase.from('admin_users').select('id,role,active').eq('id', user.id).eq('active', true).maybeSingle()
    if (!admin || !ROLES.has(admin.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const submissionId = typeof body?.submissionId === 'string' ? body.submissionId : ''
    const action = typeof body?.action === 'string' ? body.action : ''
    const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 1000) : ''
    if (!submissionId || !['approve','reject'].includes(action)) return NextResponse.json({ error: 'Invalid review request.' }, { status: 400 })
    if (action === 'reject' && !reason) return NextResponse.json({ error: 'Rejection reason is required.' }, { status: 400 })

    const { data, error } = action === 'approve'
      ? await supabase.rpc('approve_task_submission', { p_submission_id: submissionId })
      : await supabase.rpc('reject_task_submission', { p_submission_id: submissionId, p_reason: reason })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true, result: data })
  } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }
}
