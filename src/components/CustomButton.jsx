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
    if (onClick) onClick(e);
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
