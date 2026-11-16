"use client";
// Tiny fetch helper for the frontend. All data goes through our own /api
// routes — the browser never talks to Plaid directly.
export async function api<T = unknown>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });
  if (res.status === 401 && path !== "/api/auth/login" && typeof window !== "undefined") {
    window.location.replace("/lock"); // session expired -> lock screen
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error ?? `Request failed (${res.status})`), { data, status: res.status });
  return data as T;
}
