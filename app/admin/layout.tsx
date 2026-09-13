import { requireAdmin } from '@/lib/admin'

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin()
  return children
}
