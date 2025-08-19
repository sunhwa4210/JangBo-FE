// src/components/CustomButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { color } from "../styles/color";

export default function CustomButton({
  label,
  to,                
  onClick,           
  disabled = false,
  type = "button",   
  style,
  ...rest
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (disabled) return;
    // 1) 전달받은 onClick 먼저 실행(회원가입 POST 등)
    if (onClick) onClick(e);
    // 2) to가 있으면 추가로 라우팅
    if (to) navigate(to);
  };

  const baseStyle = {
    backgroundColor: color.Green[50],
    color: color.Grey.white,
    borderRadius: "8px",
    padding: "14px 16px",
    fontSize: "16px",
    fontWeight: 600,
    width: "331px",
    height: "49px",
    border: "none",
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    ...style,
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      style={baseStyle}
      {...rest}
    >
      {label}
    </button>
  );
}
