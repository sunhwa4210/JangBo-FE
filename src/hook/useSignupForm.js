import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signupCustomer,
  requestEmailCodeCustomer,
  verifyEmailCodeCustomer,
} from "../api/customers.js";
import {
  signupMerchant,
  requestEmailCodeMerchant,
  verifyEmailCodeMerchant,
} from "../api/merchants.js";

export function useSignupForm(role) {
  // 1. 입력값 상태
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [location, setLocation] = useState("");

  // 2. UI 상태
  const [loading, setLoading] = useState(false); // 회원가입 버튼 로딩
  const [sending, setSending] = useState(false); // 이메일 전송 중
  const [verifying, setVerifying] = useState(false); // 이메일 검증 중
  const [cooldown, setCooldown] = useState(0); // 재전송 쿨다운
  const [verified, setVerified] = useState(false); // 이메일 인증 완료 여부
  const [devCode, setDevCode] = useState(""); // 개발용 코드 표시
  const [msg, setMsg] = useState(""); // 성공 메시지
  const [errMsg, setErrMsg] = useState(""); // 오류 메시지

  const navigate = useNavigate();

  // 3. 이메일 형식 검사
  const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

  // 4. 쿨다운 타이머
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // 5. 이메일 변경 시 인증 상태 리셋
  useEffect(() => {
    setVerified(false);
    setEmailConfirm("");
    setDevCode("");
  }, [email]);

  //role에 따라 사용할 API 호출 처리
  const api =
    role === "merchant"
      ? {
          signup: signupMerchant, // 상인 회원가입 API
          requestCode: requestEmailCodeMerchant, // 상인 이메일 코드 요청 API
          verifyCode: verifyEmailCodeMerchant, // 상인 이메일 인증 확인 API
        }
      : {
          signup: signupCustomer, // 고객 회원가입 API
          requestCode: requestEmailCodeCustomer, // 고객 이메일 코드 요청 API
          verifyCode: verifyEmailCodeCustomer, // 고객 이메일 인증 확인 API
        };

  // 6. 이메일 인증코드 요청
  const handleRequestCode = async () => {
    setMsg("");
    setErrMsg("");
    if (!isEmail(email)) return setErrMsg("올바른 이메일을 입력해주세요.");
    if (sending || cooldown > 0) return;

    setSending(true);
    setDevCode("");

    const res = await api.requestCode({ email });
    if (res.ok) {
      setMsg("인증코드를 이메일로 보냈어요.");
      setCooldown(60);
      if (res.devCode) setDevCode(res.devCode);
    } else {
      setErrMsg(res.message);
    }

    setSending(false);
  };

  // 7. 인증코드 검증
  const handleVerifyCode = async () => {
    setMsg("");
    setErrMsg("");
    if (!isEmail(email)) return setErrMsg("올바른 이메일을 입력해주세요.");
    if (!emailConfirm.trim()) return setErrMsg("인증코드를 입력해주세요.");
    if (verifying) return;

    setVerifying(true);
    const res = await api.verifyCode({ email, code: emailConfirm.trim() });
    if (res.ok && res.verified) {
      setVerified(true);
      setMsg("이메일 인증이 완료됐어요.");
    } else {
      setVerified(false);
      setErrMsg(res.message);
    }
    setVerifying(false);
  };

  // 8. 회원가입
  const handleSignup = async () => {
    setMsg("");
    setErrMsg("");

    // 최소 검증
    if (!username.trim()) return setErrMsg("이름을 입력해주세요.");
    if (!isEmail(email)) return setErrMsg("올바른 이메일을 입력해주세요.");
    if (password.length < 8)
      return setErrMsg("비밀번호는 8자 이상이어야 합니다.");
    if (password !== passwordConfirm)
      return setErrMsg("비밀번호가 서로 달라요.");
    if (!verified) return setErrMsg("이메일 인증을 먼저 완료해주세요.");

    setLoading(true);

    const res = await api.signup({
      username,
      email,
      password,
      passwordConfirm,
    });

    console.log(res);

    if (res.ok) {
      setMsg(
        res.data?.email
          ? `가입 완료! 이메일: ${res.data.email} (ID: ${res.data.customerId})`
          : "가입이 완료되었어요."
      );

      //role에 따른 이동 경로
      if (role === "merchant") {
        navigate("/merchant/registerstore", { replace: true }); // 상점 등록 페이지로
      } else {
        navigate("/signup/customer/success", { replace: true }); //회원가입 성공 페이지
      }
    } else {
      setErrMsg(res.message);
    }

    setLoading(false);
  };

  // 9. 버튼 활성화 여부
  const isRequestDisabled = sending || cooldown > 0 || !isEmail(email);
  const isVerifyDisabled = verifying || !emailConfirm.trim() || !isEmail(email);

  return {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    emailConfirm,
    setEmailConfirm,
    location,
    setLocation,
    loading,
    msg,
    errMsg,
    sending,
    verifying,
    cooldown,
    verified,
    devCode,
    handleRequestCode,
    handleVerifyCode,
    handleSignup,
    isRequestDisabled,
    isVerifyDisabled,
  };
}
