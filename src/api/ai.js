const BASE_URL =
  (import.meta?.env?.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || "https://localhost:8080")
    .replace(/\/+$/, "");

async function req(path, { method = "GET", headers = {}, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include", // 로그인 세션 쓰면 유지, 아니면 지워도 됨
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const serverMsg = data?.message || data?.detail || `HTTP ${res.status}`;
    const err = new Error(serverMsg);
    err.status = res.status;
    err.serverMsg = serverMsg;
    err.body = data;
    throw err;
  }
  return data;
}

/** 1차: 자연어 질문 → 재료 리스트 */
export async function analyzeQuestion(question) {
  if (!question?.trim()) {
    const e = new Error("질문을 입력해 주세요.");
    e.status = 400;
    throw e;
  }
  return req("/api/ai/ingredients/analyze", {
    method: "POST",
    body: { question },
  });
}

/** 2차: 재료 + 필터 → 추천 상품 */
export async function getRecommendations({ ingredients, filter }) {
  return req("/api/ai/recommendations", {
    method: "POST",
    body: { ingredients, filter },
  });
}

/** 3차: 장바구니 일괄 담기 */
export async function bulkAddToCart(items /* [{productId, quantity?}] */) {
  return req("/api/ai/cart/bulk-add", {
    method: "POST",
    body: { items },
  });
}
