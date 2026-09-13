export default function LoginPage() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 520, paddingTop: 70 }}>
        <a className="brand" href="/">Task<span>ora</span></a>
        <section className="card" style={{ marginTop: 28 }}>
          <h1 style={{ fontSize: 38 }}>Welcome back</h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>Login with your Taskora username and password.</p>
          <form style={{ display: "grid", gap: 14, marginTop: 24 }}>
            <input aria-label="Username" placeholder="Username" autoComplete="username" style={inputStyle} />
            <input aria-label="Password" placeholder="Password" type="password" autoComplete="current-password" style={inputStyle} />
            <button className="btn btnPrimary" type="submit">Login</button>
          </form>
        </section>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 15px",
  borderRadius: 14,
  border: "1px solid var(--line)",
  background: "rgba(255,255,255,.04)",
  color: "var(--text)",
  outline: "none",
};
