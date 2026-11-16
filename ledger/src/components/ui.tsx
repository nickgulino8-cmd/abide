export function Page({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <main className="pt-safe mx-auto max-w-lg px-4 pb-28">
      <header className="mb-4 mt-2 flex items-end justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {action}
      </header>
      {children}
    </main>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section className={`rounded-2xl bg-card p-4 shadow-sm ring-1 ring-line ${className}`}>{children}</section>;
}

export function ComingSoon({ stage, items }: { stage: number; items: string[] }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">Coming in stage {stage}</p>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        {items.map((i) => <li key={i}>• {i}</li>)}
      </ul>
    </Card>
  );
}
