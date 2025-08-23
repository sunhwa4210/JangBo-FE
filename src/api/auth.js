const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(window.location.hostname);
const isDev = process.env.NODE_ENV !== "production";

const API_BASE =
  isLocalhost || isDev
    ? ""
    : process.env.REACT_APP_API_BASE_URL || "";

// 경로 조립 헬퍼
const apiUrl = (path) => `${API_BASE}${path}`;

// 공용 fetch 래퍼
function parseMaybeJson(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

async function requestWithDebug(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  const data = parseMaybeJson(text);

  if (!res.ok) {
    const serverMsg =
      (data && (data.message || data.error || data.detail)) || text || "";
    // 에러 메시지는 엔드포인트 공용으로 사용 (로그인/로그아웃/ME 공통)
    const err = new Error(
      `요청 실패: ${res.status}${serverMsg ? ` - ${serverMsg}` : ""}`
    );
    err.status = res.status;
    err.serverMsg = serverMsg;
    throw err;
  }
  return data;
}


export async function login({ email, password }) {
  const payloadEmail = (email ?? "").trim().toLowerCase(); // 이메일만 정규화
  const payloadPassword = password ?? ""; // 비번은 원본 그대로

  return requestWithDebug(apiUrl("/api/customers/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: payloadEmail, password: payloadPassword }),
  });
}

/** 로그아웃 */
export async function logout() {
  return requestWithDebug(apiUrl("/api/customers/logout"), {
    method: "POST",
    credentials: "include",
  });
}

/**세션 확인/내 정보 */
export async function getMe() {
  return requestWithDebug(apiUrl("/api/customers/me"), {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    cache: "no-store",
  });
}
