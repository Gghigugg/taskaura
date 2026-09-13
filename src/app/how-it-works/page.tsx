export default function HowItWorksPage() {
  const steps = [
    ["01", "Activate your account", "Use the approved registration flow or contact the admin for assisted account creation."],
    ["02", "Complete tasks", "Choose eligible tasks, follow the requirements and submit the required proof."],
    ["03", "Verification", "Taskora verifies submissions before eligible rewards are credited to the server-side ledger."],
    ["04", "Track rewards", "Use your wallet and transaction history to see balances and activity."],
  ];

  return (
    <main className="page">
      <div className="container" style={{ paddingTop: 50 }}>
        <a className="brand" href="/">Task<span>ora</span></a>
        <section className="hero" style={{ paddingBottom: 30 }}>
          <div className="badge">Simple by design</div>
          <h1 style={{ fontSize: 54 }}>How Taskora works.</h1>
        </section>
        <section className="grid">
          {steps.map(([number, title, text]) => (
            <article className="card" key={number}>
              <div style={{ color: "#c084fc", fontWeight: 800 }}>{number}</div>
              <h3 style={{ marginTop: 14 }}>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
