import React from "react";
import { color } from "../styles/color";
import { typo } from "../styles/typography";

function SortButton({ label, active = false, onClick }) {
  const baseStyle = {
    ...typo.caption3Emphasized,
    minWidth: 56,
    height: 25,
    padding: "0 10px",
    borderRadius: "30px",
    border: `1px solid ${color.Green[50]}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
  };

  const style = active
    ? { ...baseStyle, background: color.Green[50], color: "#fff" }
    : { ...baseStyle, color: color.Green[50], background: "transparent" };

  return (
    <div style={style} onClick={onClick} role="button" aria-pressed={active}>
      {label}
    </div>
  );
}

export default SortButton;
