import "server-only";

/**
 * Tells Plaid to revoke access for every connected bank.
 * Stage 2 fills this in with Plaid's /item/remove call.
 */
export async function disconnectAllBanks(): Promise<string[]> {
  return [];
}
