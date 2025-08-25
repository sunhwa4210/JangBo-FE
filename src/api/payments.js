// src/api/payments.js
import api from "./api";

const isValidId = (v) => /^[0-9]+$/.test(String(v || ""));

// 주문/결제 정보 확인 (checkout)
export const getCheckout = (orderId) => {
  if (!isValidId(orderId)) throw new Error("Invalid orderId");
  return api
    .get(`/payments/${orderId}/checkout`)
    .then((r) => r.data.checkout ?? r.data);
};

// 결제 요청 생성(PENDING)
// 서버가 보통 기대하는 바디 키는 paymentMethod 입니다.
// 필요하다면 successUrl/failUrl 같은 추가 파라미터를 여기에 붙이세요.
export const createPaymentRequest = async (
  orderId,
  method = "ACCOUNT_TRANSFER",
  opts = {}
) => {
  if (!isValidId(orderId)) throw new Error("Invalid orderId");

  const body = {
    paymentMethod: method, // <-- 핵심 수정 (기존: { method })
    // successUrl: `${window.location.origin}/pay/success`,
    // failUrl: `${window.location.origin}/pay/fail`,
    ...opts,
  };

  try {
    const res = await api.post(`/payments/${orderId}/request`, body);
    return res.data;
  } catch (e) {
    // 서버가 요구하는 필드/상태를 바로 확인하기 위한 로깅
    console.error("[payments.request] error", {
      orderId,
      status: e?.response?.status,
      data: e?.response?.data,
    });
    throw e;
  }
};

// 결제 상태 조회
export const getPayment = (orderId) => {
  if (!isValidId(orderId)) throw new Error("Invalid orderId");
  return api
    .get(`/payments/${orderId}`)
    .then((r) => r.data.payment ?? r.data);
};

// 결제 승인/거부/취소
export const approvePayment = (orderId) => {
  if (!isValidId(orderId)) throw new Error("Invalid orderId");
  return api.post(`/payments/${orderId}/approve`).then((r) => r.data);
};

export const declinePayment = (orderId) => {
  if (!isValidId(orderId)) throw new Error("Invalid orderId");
  return api.post(`/payments/${orderId}/decline`).then((r) => r.data);
};

export const cancelPayment = (orderId) => {
  if (!isValidId(orderId)) throw new Error("Invalid orderId");
  return api.post(`/payments/${orderId}/cancel`).then((r) => r.data);
};
