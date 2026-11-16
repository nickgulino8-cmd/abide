import { Card, ComingSoon, Page } from "@/components/ui";
import { db } from "@/lib/db";

export default async function Home() {
  const [categories, accounts] = await Promise.all([
    db.category.count({ where: { parentId: null } }),
    db.account.count(),
  ]);
  return (
    <Page title="Ledger">
      <Card className="mb-4">
        <p className="text-sm text-muted">Left to spend this month</p>
        <p className="tabular mt-1 text-4xl font-bold">$—</p>
        <p className="mt-3 text-sm text-muted">
          🔒 Secure setup complete · {categories} category groups · {accounts} account{accounts === 1 ? "" : "s"}
        </p>
      </Card>
      <ComingSoon stage={2} items={["Connect your bank with Plaid", "Balances and net cash"]} />
    </Page>
  );
}
