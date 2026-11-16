export function money(cents: number, opts: { sign?: boolean; decimals?: boolean } = {}) {
  const v = cents / 100;
  const s = Math.abs(v).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.decimals === false ? 0 : 2,
    maximumFractionDigits: opts.decimals === false ? 0 : 2,
  });
  if (v < 0) return `-${s}`;
  return opts.sign && v > 0 ? `+${s}` : s;
}
