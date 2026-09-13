export default function UnauthorizedPage() {
  return (
    <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section style={{ maxWidth: 520, textAlign: 'center' }}>
        <h1>Access denied</h1>
        <p>You do not have permission to access this TaskAura area.</p>
        <a href="/" style={{ textDecoration: 'underline' }}>Go to TaskAura home</a>
      </section>
    </main>
  )
}
