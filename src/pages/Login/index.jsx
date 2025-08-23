import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import styles from "../Login/login.module.css";
import JangboLogo from "../../assets/jangbo.svg";
import { color } from "../../styles/color";
import { typo } from "../../styles/typography";
import Input from "../../components/InputField";
import EmailIcon from "../../assets/mail.svg";
import LockIcon from "../../assets/lock.svg";
import CustomButton from "../../components/CustomButton";
import { login } from "../../api/auth"; 

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const validate = () => {
    if (!email.trim()) {
      setErrMsg("이메일을 입력해 주세요.");
      emailRef.current?.focus();
      return false;
    }
    if (!password) {
      setErrMsg("비밀번호를 입력해 주세요.");
      passwordRef.current?.focus();
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrMsg("이메일 형식을 확인해 주세요.");
      emailRef.current?.focus();
      return false;
    }
    setErrMsg("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrMsg("");

    try {
      await login({ email, password });
      navigate("/main", { replace: true });
    } catch (err) {
      const m = (err?.serverMsg || err?.message || "").toLowerCase();
      let ui = "로그인에 실패했습니다.";
      if (m.includes("authentication_failed") || m.includes("이메일 또는 비밀번호")) {
        ui = "이메일 또는 비밀번호가 올바르지 않습니다.";
      }
      setErrMsg(ui);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header label="로그인" to="/splash" />

      <div className={styles.logoSection}>
        <img src={JangboLogo} alt="logo" />
        <div
          className={styles.title}
          style={{ ...typo.title1Emphasized, color: color.Green[50] }}
        >
          장보는 <span style={{ color: color.Grey[80] }}>친구</span>
        </div>
      </div>

      <form className={styles.loginSection} onSubmit={handleSubmit} noValidate>
        <div className={styles.loginLabel} style={typo.footnote}>
          회원 서비스 이용을 위해 로그인 해주세요.
        </div>

        {/* 이메일 */}
        <Input
          ref={emailRef}
          type="email"
          label="이메일"
          icon={EmailIcon}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          autoComplete="email"
        />

        {/* 비밀번호 */}
        <Input
          ref={passwordRef}
          type="password"
          label="비밀번호"
          icon={LockIcon}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoComplete="current-password"
        />

        {/* 에러 메시지 */}
        {errMsg && <div className={styles.errorText}>{errMsg}</div>}

        {/* 제출 버튼 */}
        <div className={styles.submitButton}>
          <CustomButton
            type="submit"
            label={loading ? "로그인 중..." : "로그인"}
            disabled={loading || !email || !password}
          />
          {errMsg && <div className={styles.errorText}>{errMsg}</div>}
        </div>
      </form>
    </div>
  );
}
