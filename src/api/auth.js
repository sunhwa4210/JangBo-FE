// api/auth.js
function getCookie(name) {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return m ? m.pop() : "";
}

/**
 * Django 세션 + CSRF 기준 로그인
 * 응답 JSON에 { message } 또는 { detail }가 있으면 에러 메시지로 사용
 */
export async function login({ email, password }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

  try {
    const res = await fetch("/accounts/api/login/", {
      method: "POST",
      credentials: "include", // 세션 쿠키 전송
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.message || data?.detail || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}
