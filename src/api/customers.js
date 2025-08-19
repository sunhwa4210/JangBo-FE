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

/** 이메일 인증코드 요청 */
export async function requestEmailCode({ email }) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/api/customers/email/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  } catch (e) {
    return { ok: false, status: 0, code: "NETWORK_ERROR", message: "네트워크 오류입니다." };
  }

  // 200 OK: { sent: true, devCode?: "995689" }
  if (res.status === 200) {
    let data = null;
    try { data = await res.json(); } catch {}
    return { ok: true, status: 200, sent: !!data?.sent, devCode: data?.devCode };
  }

  let errBody = null;
  try { errBody = await res.json(); } catch {}

  if (res.status === 400) {
    // VALIDATION_ERROR, BAD_REQUEST(이미 가입된 이메일 등)
    return {
      ok: false,
      status: 400,
      code: errBody?.code || "BAD_REQUEST",
      message: errBody?.message || errBody?.detail || "요청 정보를 확인해주세요.",
      errors: errBody?.errors,
    };
  }

  return { ok: false, status: res.status, code: "UNKNOWN", message: "알 수 없는 오류입니다." };
}

/** 이메일 인증코드 검증 */
export async function verifyEmailCode({ email, code }) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/api/customers/email/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
  } catch (e) {
    return { ok: false, status: 0, code: "NETWORK_ERROR", message: "네트워크 오류입니다." };
  }

  // 200 OK: { verified: true }
  if (res.status === 200) {
    let data = null;
    try { data = await res.json(); } catch {}
    return { ok: !!data?.verified, status: 200, verified: !!data?.verified };
  }

  let errBody = null;
  try { errBody = await res.json(); } catch {}

  if (res.status === 400) {
    // VALIDATION_ERROR, BAD_REQUEST(만료/불일치)
    return {
      ok: false,
      status: 400,
      code: errBody?.code || "BAD_REQUEST",
      message: errBody?.message || errBody?.detail || "코드가 만료되었거나 일치하지 않습니다.",
      errors: errBody?.errors,
      verified: false,
    };
  }

  return { ok: false, status: res.status, code: "UNKNOWN", message: "알 수 없는 오류입니다.", verified: false };
}
