import React from "react";
import BackIcon from "../assets/back.svg";
import { useNavigate } from "react-router-dom";

function Header({ label, to, onTitleClick, button }) {
  const navigate = useNavigate();
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      height: "50px",
      padding: "0 16px",
      position: "relative",
      borderBottom: "1px solid #eee",
    },

    backIcon: {
      position: "absolute",
      left: "16px",
      cursor: "pointer",
    },

    title: {
      margin: "0 auto",
      fontWeight: "bold",
      cursor: onTitleClick ? "pointer" : "default", // 조건부로 포인터 적용
    },

    button: {
      position: "absolute",
      right: "22px",
    },
  };
  return (
    <div style={styles.container}>
      <img
        style={styles.backIcon}
        src={BackIcon}
        alt="back"
        onClick={() => navigate(to)}
      ></img>
      <div style={styles.title} onClick={onTitleClick}>
        {label}
      </div>
      {/* 조건부로 버튼 추가 */}
      {button && <div style={styles.button}>{button}</div>}
    </div>
  );
}
export default Header;
