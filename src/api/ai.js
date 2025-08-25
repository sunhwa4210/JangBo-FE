import api from "./api";
-

/** 1차: 자연어 질문 → 재료 리스트 */
export function analyzeQuestion(question) {
  if (!question?.trim()) {
    const e = new Error("질문을 입력해 주세요.");
    e.status = 400;
    throw e;
  }
  // baseURL이 "/api" 이므로 경로에는 "/api"를 중복 기입하지 않음
  return api.post("/ai/ingredients/analyze", { question }).then(r => r.data);
}

/** 2차: 재료 + 필터 → 추천 상품 */
export function getRecommendations({ ingredients, filter }) {
  return api.post("/ai/recommendations", { ingredients, filter }).then(r => r.data);
}

/** 3차: 장바구니 일괄 담기 */
export function bulkAddToCart(items /* [{ productId, quantity? }] */) {
  return api.post("/ai/cart/bulk-add", { items }).then(r => r.data);
}
