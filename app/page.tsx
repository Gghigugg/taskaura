const features = [
  ['Tasks', 'Complete eligible tasks and submit proof for verification.'],
  ['Daily Rewards', 'Build your streak with a simple daily check-in.'],
  ['Wallet', 'Track earnings, transactions and eligible withdrawals.'],
]

export default function Home() {
  return (
    <main className="page">
      <div className="container">
        <nav className="nav">
          <a className="brand" href="/">Task<span>Aura</span></a>
          <div className="navLinks">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="/login">Login</a>
          </div>
        </nav>
        <section className="hero">
          <div className="badge">Complete. Earn. Reward.</div>
          <h1>Turn tasks into rewards.</h1>
          <p>
            TaskAura is being built as a fast, transparent task and rewards platform
            with secure verification, wallet-ledger architecture and a dedicated admin system.
          </p>
          <div className="actions">
            <a className="btn btnPrimary" href="/register">Get started</a>
            <a className="btn btnGhost" href="/how-it-works">How it works</a>
          </div>
        </section>
        <section id="features" className="grid">
          {features.map(([title, text]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>
        <footer className="footer">© {new Date().getFullYear()} TaskAura. All rights reserved.</footer>
      </div>
    </main>
  )
}
