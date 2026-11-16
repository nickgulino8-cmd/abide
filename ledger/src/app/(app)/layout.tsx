import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BottomNav } from "@/components/BottomNav";
import { IdleLock } from "@/components/IdleLock";

// Every screen inside (app) requires an unlocked session.
// (The proxy checks first; this re-checks against the database.)
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/lock");
  return (
    <>
      <IdleLock minutes={session.idle} />
      {children}
      <BottomNav />
    </>
  );
}
