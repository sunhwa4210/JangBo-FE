import React from "react";
import Header from "../../components/Header";
import { typo } from "../../styles/typography";
import styles from "./SignupForm.module.css";
import CustomButton from "../../components/CustomButton";
import Input from "../../components/InputField";
import EmailIcon from "../../assets/mail.svg";
import LockIcon from "../../assets/lock.svg";
import User from "../../assets/user.svg";
import Map from "../../assets/map-pin.svg";

import { useSignupForm } from "../../hook/useSignupForm";

export default function SignupForm() {
  // 훅 호출
  const {
    email, setEmail,
    username, setUsername,
    password, setPassword,
    passwordConfirm, setPasswordConfirm,
    emailConfirm, setEmailConfirm,
    location, setLocation,
    loading, msg, errMsg,
    sending, verifying, cooldown, verified, devCode,
    handleRequestCode, handleVerifyCode, handleSignup,
    isRequestDisabled, isVerifyDisabled
  } = useSignupForm();

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
