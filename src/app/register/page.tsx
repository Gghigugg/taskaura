export default function RegisterPage() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 560, paddingTop: 70 }}>
        <a className="brand" href="/">Task<span>ora</span></a>
        <section className="card" style={{ marginTop: 28 }}>
          <h1 style={{ fontSize: 38 }}>Create your account</h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
            Account activation is configured by Taskora. Users may register through the approved activation flow or contact an admin for assisted account creation.
          </p>
          <div className="actions">
            <a className="btn btnPrimary" href="/contact">Contact Admin</a>
            <a className="btn btnGhost" href="/login">I already have an account</a>
          </div>
        </section>
      </div>
    </main>
  );
}
