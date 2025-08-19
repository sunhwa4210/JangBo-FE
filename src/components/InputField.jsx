import React from "react";

function InputField({ label, icon, type = "text", value, onChange, placeholder }) {
  return (
    <div
      className="InputContainer"
      style={{
        height: "48px",
        width: "331px",
        border: "1px solid hsla(0, 0%, 85%, 1)", // 부모에만 border
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        marginTop: "13px",
      }}
    >
      {/* 아이콘 영역 */}
      <div
        className="IconSection"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "hsla(0, 0%, 95%, 1)",
          width: "48px",
          height: "100%",
          boxSizing: "border-box",
          boxShadow: "inset -1px 0 0 hsla(0, 0%, 85%, 1)", 

        }}
      >
        <img
          src={icon}
          alt="icon"
          style={{
            width: "24px",
            height: "24px",
          }}
        />
      </div>

      {/* 입력 영역 */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        style={{
          flex: 1,
          height: "100%",
          border: "none",
          outline: "none",
          paddingLeft: "12px",
          fontSize: "14px",
          background: "transparent",
        }}
      />
    </div>
  );
}

export default InputField;
