import http from "./http";
import axios from "axios";
// const BASE_URL =
//   import.meta?.env?.VITE_API_BASE_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   "http://3.36.56.52:8080";
const api = axios.create({
  baseURL: "/api", // dev 프록시/배포 리버스 프록시 가정
  withCredentials: true, // 세션 쿠키 전송
  timeout: 8000,
});

/** 상인 회원가입 */
export async function signupMerchant({
  username,
  email,
  password,
  passwordConfirm,
}) {
  try {
    const res = await api.post("/merchants/signup", {
      username,
      email,
      password,
      passwordConfirm,
    });

    return { ok: true, data: res.data };
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data || {};
    if (status === 400) {
      return {
        ok: false,
        status,
        code: data.code || "BAD_REQUEST",
        message: data.message || data.detail || "입력값 확인 필요",
        errors: data.errors,
      };
    }
    if (status === 409) {
      return {
        ok: false,
        status,
        code: "DATA_INTEGRITY_VIOLATION",
        message: data.message || "이미 사용 중인 정보",
      };
    }
    return {
      ok: false,
      status: status ?? 0,
      message: data.message || "알 수 없는 오류",
    };
  }
}

/** 이메일 인증코드 요청 */
export async function requestEmailCodeMerchant({ email }) {
  try {
    const res = await api.post("/merchants/email/request", { email });
    return {
      ok: true,
      status: res.status,
      sent: !!res.data?.sent,
      devCode: res.data?.devCode,
    };
  } catch (err) {
    const status = err?.response?.status ?? 0;
    const data = err?.response?.data || {};
    return {
      ok: false,
      status,
      code: data.code || "BAD_REQUEST",
      message: data.message || "요청 오류",
    };
  }
}

/** 이메일 인증코드 검증 */
export async function verifyEmailCodeMerchant({ email, code }) {
  try {
    const res = await api.post("/merchants/email/verify", { email, code });
    return { ok: true, status: res.status, verified: !!res.data?.verified };
  } catch (err) {
    const status = err?.response?.status ?? 0;
    const data = err?.response?.data || {};
    return {
      ok: false,
      status,
      code: data.code || "BAD_REQUEST",
      message: data.message || "코드 불일치",
      verified: false,
    };
  }
}
