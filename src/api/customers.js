const BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "https://api.nullheather.shop";

/** 고객 회원가입 */
export async function signupCustomer({ username, email, password, passwordConfirm }) {
  const res = await fetch(`${BASE_URL}/api/customers/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, passwordConfirm }),
  });

  if (res.status === 201) {
    const data = await res.json();
    return { ok: true, data }; // {created, customerId, email}
  }

  let errBody = null;
  try { errBody = await res.json(); } catch {}

  if (res.status === 400) {
    return {
      ok: false,
      status: 400,
      code: errBody?.code || "BAD_REQUEST",
      message: errBody?.message || errBody?.detail || "입력값을 확인해주세요.",
      errors: errBody?.errors
    };
  }
  if (res.status === 409) {
    return {
      ok: false,
      status: 409,
      code: "DATA_INTEGRITY_VIOLATION",
      message: errBody?.message || "이미 사용 중인 정보입니다."
    };
  }

  return { ok: false, status: res.status, message: "알 수 없는 오류입니다." };
}
