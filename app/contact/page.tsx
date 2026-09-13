export default function ContactPage() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 680, paddingTop: 70 }}>
        <a className="brand" href="/">Task<span>Aura</span></a>
        <section className="card" style={{ marginTop: 28 }}>
          <h1 style={{ fontSize: 40 }}>Contact Admin</h1>
          <p className="muted">
            Need an assisted account, payment confirmation, task support or account help? Contact the TaskAura admin. Contact details will be configured from the Admin Settings system.
          </p>
          <div className="card" style={{ marginTop: 18, background: "rgba(255,255,255,.025)" }}>
            <strong>Admin-assisted registration</strong>
            <p style={{ marginTop: 8 }}>The admin can record the activation payment, create the user account and issue a one-time temporary password securely.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
