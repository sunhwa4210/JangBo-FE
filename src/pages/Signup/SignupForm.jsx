import React, { useState } from "react";
import Header from "../../components/Header";
import { typo } from "../../styles/typography";
import styles from "./SignupForm.module.css";
import CustomButton from "../../components/CustomButton";
import Input from "../../components/InputField";
import EmailIcon from "../../assets/mail.svg";
import LockIcon from "../../assets/lock.svg";
import User from "../../assets/user.svg";
import Map from "../../assets/map-pin.svg";

const BASE_URL = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/+$/, "");
const SIGNUP_PATH = "/api/customers/signup"; // 고정 경로
const SIGNUP_URL = `${BASE_URL}${SIGNUP_PATH}`; // BASE 없으면 상대경로로 호출됨

export default function SignupForm() {
  // 입력값
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [location, setLocation] = useState(""); // 서버 전송 X

  // UI
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const handleSignup = async () => {
    setMsg(""); setErrMsg("");

    // 최소 검증
    if (!username.trim()) return setErrMsg("이름을 입력해주세요.");
    if (!isEmail(email)) return setErrMsg("올바른 이메일을 입력해주세요.");
    if (password.length < 8) return setErrMsg("비밀번호는 8자 이상이어야 합니다.");
    if (password !== passwordConfirm) return setErrMsg("비밀번호가 서로 달라요.");

    setLoading(true);
    try {
      const res = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, passwordConfirm }),
        // credentials: "include", // 쿠키 인증 필요 시 해제
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

      // 에러 메시지 간단 매핑
      if (res.status === 400) {
        return setErrMsg(
          data?.message || data?.detail || "입력값을 확인해주세요. (이메일 인증/중복 가능)"
        );
      }
      if (res.status === 409) {
        return setErrMsg(data?.message || "이미 사용 중인 정보입니다.");
      }
      setErrMsg(data?.message || "알 수 없는 오류가 발생했어요.");
    } catch {
      setErrMsg("서버 연결에 실패했어요. 네트워크를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header label="회원가입" to="/signup" />
    {/*회원가입 Section*/}
    <div className={styles.signupSection}>
    <div style={typo.footnoteEmphasized}>회원가입 정보를 입력해주세요</div>
    <div className={styles.inputContainer}>
      <Input type="email" label="이메일" icon={EmailIcon}
        value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일(아이디)" />
      <Input type="password" label="비밀번호" icon={LockIcon}
        value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
      <Input type="password" label="비밀번호 재입력" icon={LockIcon}
        value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="비밀번호 재입력" />
      <Input type="text" label="이름" icon={User}
        value={username} onChange={(e) => setUsername(e.target.value)} placeholder="이름" />
      <Input type="text" label="위치(선택)" icon={Map}
        value={location} onChange={(e) => setLocation(e.target.value)} placeholder="공릉동 도깨비시장" />
    </div>
    </div>

    {/*이메일 확인 Section*/}
    <div className={styles.emailConfirmSection}>
    <div style={typo.footnoteEmphasized}>이메일 인증하기</div>
    <div className={styles.inputContainer}>
      <Input type="email" label="이메일확인" icon={EmailIcon}
        value={emailConfirm} onChange={(e) => setEmailConfirm(e.target.value)} placeholder="123456" />
    </div> 
    </div>   

    <div>
        <CustomButton label="완료" onClick={handleSignup} disabled={loading} />
    </div>
    

      {msg && <div style={{ marginTop: 12, color: "#0a7" }}>{msg}</div>}
      {errMsg && <div style={{ marginTop: 12, color: "#d33" }}>{errMsg}</div>}

      
    </div>
  );
}
