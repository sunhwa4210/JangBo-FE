// src/api/customer.js

const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || "https://api.nullheather.shop";

/** 고객 회원가입 */
export async function signupCustomer({ username, email, password, passwordConfirm }) {
  const res = await fetch(`${BASE_URL}/api/customers/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, passwordConfirm }),
  });

  if (res.status === 201) {
    const data = await res.json();
    return { ok: true, data }; // { created, customerId, email }
  }

  let errBody = null;
  try { errBody = await res.json(); } catch {}

  if (res.status === 400) {
    return { ok: false, status: 400, code: errBody?.code || "BAD_REQUEST", message: errBody?.message || errBody?.detail || "입력값 확인 필요", errors: errBody?.errors };
  }

  if (res.status === 409) {
    return { ok: false, status: 409, code: "DATA_INTEGRITY_VIOLATION", message: errBody?.message || "이미 사용 중인 정보" };
  }

  return { ok: false, status: res.status, message: "알 수 없는 오류" };
}

/** 이메일 인증코드 요청 */
export async function requestEmailCode({ email }) {
  try {
    const res = await fetch(`${BASE_URL}/api/customers/email/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.status === 200) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, status: 200, sent: !!data.sent, devCode: data?.devCode };
    }

    const errBody = await res.json().catch(() => null);
    return { ok: false, status: res.status, code: errBody?.code || "BAD_REQUEST", message: errBody?.message || "요청 오류" };

  } catch (e) {
    return { ok: false, status: 0, code: "NETWORK_ERROR", message: "네트워크 오류" };
  }
}

/** 이메일 인증코드 검증 */
export async function verifyEmailCode({ email, code }) {
  try {
    const res = await fetch(`${BASE_URL}/api/customers/email/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (res.status === 200) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, status: 200, verified: !!data.verified };
    }

    const errBody = await res.json().catch(() => null);
    return { ok: false, status: res.status, code: errBody?.code || "BAD_REQUEST", message: errBody?.message || "코드 불일치", verified: false };

  } catch (e) {
    return { ok: false, status: 0, code: "NETWORK_ERROR", message: "네트워크 오류", verified: false };
  }
}
