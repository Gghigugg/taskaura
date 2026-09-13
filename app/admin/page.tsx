import { requireAdmin } from '@/lib/admin'

export default async function AdminPage() {
  const { admin } = await requireAdmin()

  return (
    <main style={{ padding: 32 }}>
      <h1>TaskAura Admin</h1>
      <p>Signed in as {admin.username} · {admin.role}</p>
      <p>Admin authorization is active. The detailed admin modules can be added without bypassing this guard.</p>
    </main>
  )
}
