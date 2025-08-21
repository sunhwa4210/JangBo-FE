import { color } from "../../../styles/color";
import React, { useState } from "react";

function Button({ label, onClick, selected = false }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      style={{
        backgroundColor: selected ? color.Green[5] : color.Grey.white,
        border: selected
          ? `1px solid ${color.Green[50]}`
          : `1px solid ${color.Grey[40]}`,
        borderRadius: "30px",
        paddingVertical: "14px",
        paddingHorizental: "32px",
        fontSize: "17px",
        fontWeight: "600",
        width: "180px",
        height: "60px",
        color: selected ? color.Green[50] : "hsla(0, 0%, 0%, 1)",
      }}
    >
      {label}
    </button>
  );
}

export default Button;
