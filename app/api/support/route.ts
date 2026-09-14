import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export async function POST(request: Request){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)return NextResponse.json({error:'Unauthorized'},{status:401})
 const {data:account}=await supabase.from('users').select('id').eq('auth_user_id',user.id).maybeSingle(); if(!account)return NextResponse.json({error:'Account not found'},{status:404})
 const body=await request.json().catch(()=>null); const category=String(body?.category||'general').slice(0,50); const subject=String(body?.subject||'').trim().slice(0,160); const description=String(body?.description||'').trim().slice(0,5000)
 if(!subject||!description)return NextResponse.json({error:'Subject and description are required.'},{status:400})
 const {data,error}=await supabase.from('support_tickets').insert({user_id:account.id,category,subject,description,priority:'normal',status:'open'}).select('id,status,created_at').single()
 if(error)return NextResponse.json({error:'Could not create ticket.'},{status:500}); return NextResponse.json({ok:true,ticket:data})
}