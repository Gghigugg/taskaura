'use client'

import { useState } from 'react'

export default function WithdrawForm({ balance }: { balance: number }) {
  const [amount,setAmount]=useState(''); const [method,setMethod]=useState('upi'); const [referenceId,setReferenceId]=useState(''); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false)
  async function submit(e: React.FormEvent) { e.preventDefault(); setMessage(''); const n=Number(amount); if(!Number.isFinite(n)||n<100){setMessage('Minimum withdrawal is ₹100.');return} if(n>balance){setMessage('Insufficient available balance.');return} setBusy(true); try { const r=await fetch('/api/withdraw',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({amount:n,method,referenceId})}); const j=await r.json(); if(!r.ok) throw new Error(j.error||'Withdrawal failed'); setMessage(`Withdrawal request created: ${j.withdrawalId}`); setAmount(''); setReferenceId('') } catch(e) { setMessage(e instanceof Error?e.message:'Withdrawal failed') } finally {setBusy(false)} }
  return <form onSubmit={submit} className="feature-card"><label>Amount<input value={amount} onChange={e=>setAmount(e.target.value)} inputMode="decimal" placeholder="₹100 or more" /></label><label>Method<select value={method} onChange={e=>setMethod(e.target.value)}><option value="upi">UPI</option><option value="bank">Bank</option><option value="qr">QR</option></select></label><label>UPI / Bank / QR reference<input value={referenceId} onChange={e=>setReferenceId(e.target.value)} placeholder="Enter payout details/reference" maxLength={200}/></label><button disabled={busy}>{busy?'Submitting…':'Request Withdrawal'}</button>{message&&<p role="status">{message}</p>}</form>
}
