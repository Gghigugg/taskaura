import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'
import TaskForm from '../task-form'

export default async function NewTaskPage(){const {admin}=await requireAdmin(); if(!['Super Admin','Task Manager'].includes(admin.role)) return <main className="deny">Not authorized to manage tasks.</main>; return <main className="page"><Link href="/admin/tasks">← Tasks</Link><p className="eyebrow">TASKAURA ADMIN · CREATE</p><h1>Create Task</h1><TaskForm/><style>{`.page{min-height:100vh;background:#07070a;color:#fff;padding:24px 16px 60px;max-width:800px;margin:auto}.page>a{color:#aaa;text-decoration:none;font-size:13px}.eyebrow{font-size:10px;letter-spacing:.2em;color:#888;margin-top:28px}.page h1{font-size:30px;margin:5px 0}.deny{padding:40px;color:#fff;background:#07070a;min-height:100vh}`}</style></main>}
