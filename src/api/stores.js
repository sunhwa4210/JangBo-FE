// src/api/stores.js
const BASE_URL =
  (import.meta?.env?.VITE_API_BASE_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:8080").replace(/\/+$/, "");

export async function fetchStores({ sort } = {}) {
  const url = new URL(`${BASE_URL}/api/stores`);
  if (sort === "recent") url.searchParams.set("sort", "recent");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // 필요 시: credentials: "include",
  });

  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch {}
    const msg = body?.message || body?.detail || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  const stores = Array.isArray(data?.stores) ? data.stores : [];

  return stores.map((s) => ({
    ...s,
    storeImgUrl: s.storeImgUrl ?? s.storeImage ?? null,
    openTimeShort: s.openTime?.slice(0, 5) ?? null,
    closeTimeShort: s.closeTime?.slice(0, 5) ?? null,
  }));
}
