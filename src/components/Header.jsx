import React from "react";
import BackIcon from "../assets/back.svg";
import { useNavigate } from "react-router-dom";

function Header({ label, to, onTitleClick }) {
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
  };
  return (
    <div style={styles.container}>
      <img
        style={styles.backIcon}
        src={BackIcon}
        alt="back"
        onClick={() => navigate(to)}
      ></img>
      <div style={styles.title} onClick={onTitleClick}>{label}</div>
    </div>
  );
}
export default Header;
