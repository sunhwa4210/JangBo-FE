import React, { useState } from "react";
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);

    try {
      const data = await login({ email, password }); // ← API 호출
      console.log("로그인 성공:", data);
      // TODO: 성공 후 라우팅/상태 업데이트 (예: navigate("/"))
    } catch (err) {
      setErrMsg(err.message || "로그인에 실패했습니다.");
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

      <form className={styles.loginSection} onSubmit={handleSubmit}>
        <div className={styles.loginLabel} style={typo.footnote}>
          회원 서비스 이용을 위해 로그인 해주세요.
        </div>

        {/* 이메일 */}
        <Input
          type="email"
          label="이메일"
          icon={EmailIcon}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />

        {/* 비밀번호 */}
        <div />
        <Input
          type="password"
          label="비밀번호"
          icon={LockIcon}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />

        {/* 에러 메시지 */}
        {/* {errMsg && <div className={styles.errorText}>{errMsg}</div>} */}

        <div className="submitButton" />
          <CustomButton
            type="submit"
            label={"로그인"}
            disabled={loading}
          />
       
      </form>
    </div>
  );
}

export default Login;
