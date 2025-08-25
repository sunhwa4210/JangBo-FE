import React from "react";
import { typo } from "../../styles/typography";
import { color } from "../../styles/color";
import Jangbo from "../../assets/jangbo.svg";
import CustomButton from "../../components/CustomButton";
import styles from "./SignupSuccess.module.css";
import { useParams, useNavigate } from "react-router-dom";

function SignupSuccess() {
  const { role } = useParams();
  const navigate = useNavigate();

  //회원 유형에 따라 홈 이동
  const handleStart = () => {
    if (role === "merchant") {
      const storeId = localStorage.getItem("storeId");
      navigate(`/merchant/store/${storeId}`); // 상인 홈으로 이동
    } else {
      navigate("/main"); // 고객 홈으로 이동
    }
  };
  return (
    <div className={styles.container}>
      <div style={typo.headlineEmphasized}>회원가입 성공!</div>
      <img className={styles.jangbo} src={Jangbo} alt="장보"></img>
      <div style={typo.caption2}>우리동네 식자재 찾기부터 픽업까지</div>
      <div style={typo.body}>
        <span style={{ ...typo.bodyEmphasized, color: color.Green[50] }}>
          장보는
        </span>
        <span style={typo.bodyEmphasized}>친구와</span> 함께 해요
      </div>

      <CustomButton
        className={styles.button}
        label="시작하기"
        onClick={handleStart}
      ></CustomButton>
    </div>
  );
}
export default SignupSuccess;
