import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const STATUSES = new Set(['draft','active','paused','completed','expired','archived'])
const ROLES = new Set(['Super Admin','Task Manager'])

async function getAdmin() {
  const supabase = await createClient()
  const { data:{user} } = await supabase.auth.getUser()
  if (!user) return { supabase, user:null, admin:null }
  const { data:admin } = await supabase.from('admin_users').select('id,username,role,active').eq('id',user.id).eq('active',true).maybeSingle()
  return { supabase, user, admin }
}

function parse(body:any) {
  const name=String(body.name||'').trim(); const category=String(body.category||'').trim()
  const description=String(body.description||'').trim().slice(0,5000)
  const taskLink=String(body.taskLink||'').trim(); const reward=Number(body.reward)
  const estimatedMinutes=body.estimatedMinutes===''||body.estimatedMinutes==null?null:Number(body.estimatedMinutes)
  const proofRequired=Boolean(body.proofRequired); const proofRequirements=String(body.proofRequirements||'').trim().slice(0,3000)
  const deadline=String(body.deadline||'').trim(); const status=String(body.status||'draft')
  if(name.length<2||name.length>160) throw new Error('Task name must be 2–160 characters.')
  if(category.length<1||category.length>80) throw new Error('Category is required.')
  if(!Number.isFinite(reward)||reward<0) throw new Error('Reward must be a valid non-negative amount.')
  if(estimatedMinutes!==null && (!Number.isInteger(estimatedMinutes)||estimatedMinutes<1)) throw new Error('Estimated minutes must be a positive whole number.')
  if(taskLink){ try{const u=new URL(taskLink); if(!['http:','https:'].includes(u.protocol)) throw 0}catch{throw new Error('Task link must be a valid http/https URL.')}}
  if(proofRequired && !proofRequirements) throw new Error('Proof requirements are required when proof is enabled.')
  if(!STATUSES.has(status)) throw new Error('Invalid task status.')
  let deadlineIso=null
  if(deadline){const d=new Date(deadline); if(Number.isNaN(d.getTime())) throw new Error('Invalid deadline.'); deadlineIso=d.toISOString()}
  return {name,category,description:description||null,task_link:taskLink||null,reward,estimated_minutes:estimatedMinutes,proof_required:proofRequired,proof_requirements:proofRequired?proofRequirements:null,deadline:deadlineIso,status}
}

export async function POST(request:Request){
  const {supabase,user,admin}=await getAdmin(); if(!user)return NextResponse.json({error:'Unauthorized'},{status:401}); if(!admin||!ROLES.has(admin.role))return NextResponse.json({error:'Not authorized.'},{status:403})
  try{const values=parse(await request.json()); const {data:task,error}=await supabase.from('tasks').insert({...values,created_by:user.id}).select('id').single(); if(error)throw error; return NextResponse.json({ok:true,task})}catch(e:any){return NextResponse.json({error:e.message||'Could not create task.'},{status:400})}
}

export async function PATCH(request:Request){
  const {supabase,user,admin}=await getAdmin(); if(!user)return NextResponse.json({error:'Unauthorized'},{status:401}); if(!admin||!ROLES.has(admin.role))return NextResponse.json({error:'Not authorized.'},{status:403})
  try{const body=await request.json(); const id=String(body.id||''); if(!id)return NextResponse.json({error:'Task id is required.'},{status:400}); const values=parse(body); const {data:task,error}=await supabase.from('tasks').update(values).eq('id',id).select('id').single(); if(error)throw error; return NextResponse.json({ok:true,task})}catch(e:any){return NextResponse.json({error:e.message||'Could not update task.'},{status:400})}
}
