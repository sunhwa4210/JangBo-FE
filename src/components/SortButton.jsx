import React from "react";
import { color } from "../styles/color";
import { typo } from "../styles/typography";

function SortButton({ label }) {
  return (
    <div
      style={{
        ...typo.caption3Emphasized,
        width: "48px",
        height: "25px",
        borderRadius: "30px",
        border: `1px solid ${color.Green[50]}`, 
        color: color.Green[50],
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {label}
    </div>
  );
}

export default SortButton;
