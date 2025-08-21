import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import { typo } from "../../styles/typography";
import { color } from "../../styles/color";
import styles from "../Signup/SignupSelectRole.module.css";
import Button from "./components/button";

//함수명 변경
function SignupSelectRole() {
  const [role, setRole] = useState(null); // 선택된 role(고객/상인)
  const navigate = useNavigate();

  const handleNext = () => {
    if (!role) {
      alert("회원가입 유형을 선택해주세요!");
      return;
    }
    navigate(`/signup/${role}`); //role에 따라 경로 이동
  };
  return (
    <div>
      <Header label="회원가입" to="/splash"></Header>
      <div className={styles.container}>
        <div className={styles.label} style={typo.footnoteEmphasized}>
          회원가입 유형을 선택해주세요
        </div>
        <div className={styles.buttonSelect}>
          {/* 선택한 role 저장 */}
          <Button
            label="고객"
            onClick={() => setRole("customer")}
            selected={role === "customer"}
          />
          <Button
            label="상인"
            onClick={() => setRole("merchant")}
            selected={role === "merchant"}
          />
        </div>
        <CustomButton
          label="다음"
          className={styles.next}
          onClick={handleNext}
        ></CustomButton>
      </div>
    </div>
  );
}

export default SignupSelectRole;
