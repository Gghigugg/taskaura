import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('id, username, role, active')
    .eq('id', user.id)
    .eq('active', true)
    .maybeSingle()

  if (error || !admin) redirect('/unauthorized')

  return { supabase, user, admin }
}
