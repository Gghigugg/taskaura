import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const amount = Number(body?.amount)
    const method = typeof body?.method === 'string' ? body.method.toLowerCase() : ''
    const referenceId = typeof body?.referenceId === 'string' ? body.referenceId : null
    const idempotencyKey = typeof body?.idempotencyKey === 'string' && body.idempotencyKey.length >= 8 ? body.idempotencyKey.slice(0,128) : randomUUID()
    if (!Number.isFinite(amount) || amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    if (!['upi','bank','qr'].includes(method)) return NextResponse.json({ error: 'Invalid withdrawal method' }, { status: 400 })
    const { data, error } = await supabase.rpc('request_withdrawal', { p_amount: amount, p_method: method, p_reference_id: referenceId, p_idempotency_key: idempotencyKey })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ withdrawalId: data }, { status: 201 })
  } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
}
