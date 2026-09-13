'use client'

import { useState } from 'react'

export default function SubmissionActions({ submissionId }: { submissionId: string }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function act(action: 'approve' | 'reject') {
    if (busy) return
    let reason = ''
    if (action === 'reject') {
      reason = window.prompt('Rejection reason (required):', '')?.trim() || ''
      if (!reason) return
    }
    setBusy(true); setMessage('')
    try {
      const res = await fetch('/api/admin/submissions/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ submissionId, action, reason }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Action failed')
      setMessage(action === 'approve' ? 'Approved and reward credited.' : 'Rejected.')
      window.location.reload()
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Action failed') } finally { setBusy(false) }
  }

  return <div className="actions"><button disabled={busy} onClick={() => act('approve')}>✓ Approve</button><button disabled={busy} onClick={() => act('reject')}>Reject</button>{message && <small>{message}</small>}<style>{`.actions{display:flex;gap:8px;align-items:center;margin-top:14px;flex-wrap:wrap}.actions button{border:1px solid #30303a;background:#1a1a22;color:#fff;border-radius:10px;padding:10px 14px;font-weight:700}.actions button:first-child{background:#fff;color:#08080a}.actions button:disabled{opacity:.5}.actions small{color:#aaa}`}</style></div>
}
