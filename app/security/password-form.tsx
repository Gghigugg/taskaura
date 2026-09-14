'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PasswordForm(){
 const [password,setPassword]=useState(''); const [confirm,setConfirm]=useState(''); const [msg,setMsg]=useState(''); const [busy,setBusy]=useState(false)
 async function submit(e:React.FormEvent){e.preventDefault();setMsg('');if(password.length<8)return setMsg('Password must be at least 8 characters.');if(password!==confirm)return setMsg('Passwords do not match.');setBusy(true);const {error}=await createClient().auth.updateUser({password});setBusy(false);setMsg(error?error.message:'Password updated successfully.');if(!error){setPassword('');setConfirm('')}}
 return <form onSubmit={submit} className="feature-card" style={{marginTop:16}}><h2>Change password</h2><input className="field" type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required/><input className="field" type="password" placeholder="Confirm new password" value={confirm} onChange={e=>setConfirm(e.target.value)} minLength={8} required/><button className="action-button" disabled={busy}>{busy?'Updating…':'Update password'}</button>{msg&&<p className="muted">{msg}</p>}</form>
}