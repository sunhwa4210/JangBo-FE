import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { typo } from "../../styles/typography";
import styles from "./SignupForm.module.css";
import CustomButton from "../../components/CustomButton";
import Input from "../../components/InputField";
import EmailIcon from "../../assets/mail.svg";
import LockIcon from "../../assets/lock.svg";
import User from "../../assets/user.svg";
import Map from "../../assets/map-pin.svg";

// BASE_URL
const BASE_URL = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/+$/, "");

// 고정 경로
const SIGNUP_PATH = "/api/customers/signup";
const EMAIL_REQUEST_PATH = "/api/customers/email/request";
const EMAIL_VERIFY_PATH = "/api/customers/email/verify";

// 최종 URL
const SIGNUP_URL = `${BASE_URL}${SIGNUP_PATH}`;
const EMAIL_REQUEST_URL = `${BASE_URL}${EMAIL_REQUEST_PATH}`;
const EMAIL_VERIFY_URL = `${BASE_URL}${EMAIL_VERIFY_PATH}`;

export default function SignupForm() {
  // 입력값
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailConfirm, setEmailConfirm] = useState(""); // 인증코드
  const [location, setLocation] = useState(""); // 서버 전송 X

  // UI
  const [loading, setLoading] = useState(false); // 회원가입 버튼 로딩
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // 이메일 인증 상태
  const [sending, setSending] = useState(false);     // 코드 전송 중
  const [verifying, setVerifying] = useState(false); // 코드 검증 중
  const [cooldown, setCooldown] = useState(0);       // 재전송 쿨다운(초)
  const [verified, setVerified] = useState(false);   // 인증 완료 여부
  const [devCode, setDevCode] = useState("");        // 개발용 코드 표시

  const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

  // 쿨다운 타이머
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // 이메일 변경 시 인증상태 리셋
  useEffect(() => {
    setVerified(false);
    setEmailConfirm("");
    setDevCode("");
  }, [email]);

  // 인증코드 요청
  const handleRequestCode = async () => {
    setMsg(""); setErrMsg("");
    if (!isEmail(email)) return setErrMsg("올바른 이메일을 입력해주세요.");
    if (cooldown > 0 || sending) return;

    setSending(true);
    setDevCode("");
    try {
      const res = await fetch(EMAIL_REQUEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (res.status === 200 && data?.sent) {
        setMsg("인증코드를 이메일로 보냈어요.");
        setCooldown(60); // 필요 시 90/120으로 변경 가능
        if (data?.devCode) setDevCode(String(data.devCode)); // 개발용
        return;
      }

      if (res.status === 400) {
        return setErrMsg(data?.message || data?.detail || "요청 정보를 확인해주세요.");
      }

      setErrMsg(data?.message || "인증코드 요청에 실패했어요.");
    } catch (e) {
      setErrMsg(e?.name === "AbortError"
        ? "요청이 시간 초과됐어요. 잠시 후 다시 시도해주세요."
        : "네트워크 오류로 인증코드 요청에 실패했어요.");
    } finally {
      setSending(false);
    }
  };

  // 인증코드 검증
  const handleVerifyCode = async () => {
    setMsg(""); setErrMsg("");
    if (!isEmail(email)) return setErrMsg("올바른 이메일을 입력해주세요.");
    if (!emailConfirm.trim()) return setErrMsg("인증코드를 입력해주세요.");
    if (verifying) return;

    setVerifying(true);
    try {
      const res = await fetch(EMAIL_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: emailConfirm.trim() }),
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (res.status === 200 && data?.verified) {
        setVerified(true);
        setMsg("이메일 인증이 완료됐어요.");
        return;
      }

      if (res.status === 400) {
        setVerified(false);
        return setErrMsg(data?.message || data?.detail || "코드가 만료되었거나 일치하지 않습니다.");
      }

      setVerified(false);
      setErrMsg(data?.message || "인증에 실패했어요.");
    } catch (e) {
      setVerified(false);
      setErrMsg(e?.name === "AbortError"
        ? "요청이 시간 초과됐어요. 잠시 후 다시 시도해주세요."
        : "네트워크 오류로 인증에 실패했어요.");
    } finally {
      setVerifying(false);
    }
  };

  // 회원가입
  const handleSignup = async () => {
    setMsg(""); setErrMsg("");

    // 최소 검증
    if (!username.trim()) return setErrMsg("이름을 입력해주세요.");
    if (!isEmail(email)) return setErrMsg("올바른 이메일을 입력해주세요.");
    if (password.length < 8) return setErrMsg("비밀번호는 8자 이상이어야 합니다.");
    if (password !== passwordConfirm) return setErrMsg("비밀번호가 서로 달라요.");
    if (!verified) return setErrMsg("이메일 인증을 먼저 완료해주세요.");

    setLoading(true);
    try {
      const res = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, passwordConfirm }),
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (res.status === 201) {
        setMsg(
          data?.email && data?.customerId
            ? `가입 완료! 이메일: ${data.email} (ID: ${data.customerId})`
            : "가입이 완료되었어요."
        );
        return;
      }

      if (res.status === 400) {
        return setErrMsg(
          data?.message || data?.detail || "입력값을 확인해주세요. (이메일 인증/중복 가능)"
        );
      }
      if (res.status === 409) {
        return setErrMsg(data?.message || "이미 사용 중인 정보입니다.");
      }
      setErrMsg(data?.message || "알 수 없는 오류가 발생했어요.");
    } catch (e) {
      setErrMsg(e?.name === "AbortError"
        ? "요청이 시간 초과됐어요. 잠시 후 다시 시도해주세요."
        : "서버 연결에 실패했어요. 네트워크를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const isRequestDisabled = sending || cooldown > 0 || !isEmail(email);
  const isVerifyDisabled = verifying || !emailConfirm.trim() || !isEmail(email);

  return (
    <div className={styles.container}>
      <Header label="회원가입" to="/signup" />

      {/* 회원가입 Section */}
      <div className={styles.signupSection}>
        <div style={typo.footnoteEmphasized}>회원가입 정보를 입력해주세요</div>
        <div className={styles.inputContainer}>
          <Input
            type="email"
            label="이메일"
            icon={EmailIcon}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일(아이디)"
          />
          <Input
            type="password"
            label="비밀번호"
            icon={LockIcon}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
          <Input
            type="password"
            label="비밀번호 재입력"
            icon={LockIcon}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호 재입력"
          />
          <Input
            type="text"
            label="이름"
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이름"
          />
          <Input
            type="text"
            label="위치(선택)"
            icon={Map}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="공릉동 도깨비시장"
          />
        </div>
      </div>

      {/* 이메일 확인 Section */}
      <div className={styles.emailConfirmSection}>
        <div style={typo.footnoteEmphasized}>이메일 인증하기</div>

        <div className={styles.inputContainer} style={{ gap: 8 }}>
          {/* 개발환경에서만 노출 권장 */}
          {devCode && (
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
              개발용 코드: <b>{devCode}</b>
            </div>
          )}

          <Input
            type="text"
            label="이메일 확인 코드"
            icon={EmailIcon}
            value={emailConfirm}
            onChange={(e) => setEmailConfirm(e.target.value)}
            placeholder="123456"
            rightElement={
              <>
                <button
                  onClick={handleRequestCode}
                  disabled={isRequestDisabled}
                  aria-disabled={isRequestDisabled}
                  style={{
                    border: "1px solid #ccc",
                    background: "#f9f9f9",
                    padding: "6px 10px",
                    borderRadius: 4,
                    fontSize: 13,
                    cursor: isRequestDisabled ? "not-allowed" : "pointer",
                    opacity: isRequestDisabled ? 0.6 : 1,
                  }}
                >
                  {cooldown > 0 ? `재전송 (${cooldown}s)` : (sending ? "전송 중..." : "재전송")}
                </button>
                <button
                  onClick={handleVerifyCode}
                  disabled={isVerifyDisabled}
                  aria-disabled={isVerifyDisabled}
                  style={{
                    border: "1px solid #10b981",
                    background: "#fff",
                    color: "#10b981",
                    padding: "6px 10px",
                    borderRadius: 4,
                    fontSize: 13,
                    cursor: isVerifyDisabled ? "not-allowed" : "pointer",
                    opacity: isVerifyDisabled ? 0.6 : 1,
                    fontWeight: 700,
                  }}
                >
                  {verifying ? "검증 중..." : "인증"}
                </button>
              </>
            }
          />

          {verified && (
            <div style={{ color: "green", fontSize: 13, marginTop: 6 }}>
              이메일 인증이 완료됐어요.
            </div>
          )}
        </div>
      </div>

      {/* 가입 완료 버튼 */}
      <div>
        <CustomButton label="완료" onClick={handleSignup} disabled={loading || !verified} />
      </div>

      {msg && <div style={{ marginTop: 12, color: "#0a7" }}>{msg}</div>}
      {errMsg && <div style={{ marginTop: 12, color: "#d33" }}>{errMsg}</div>}
    </div>
  );
}
