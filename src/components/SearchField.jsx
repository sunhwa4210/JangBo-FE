// src/components/SearchField.jsx
import React from "react";
import { color } from "../styles/color";
import SearchBtn from "../assets/searchBtn.svg";

function SearchField({ label, value, onChange, onSubmit }) {
  const styles = {
    container: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },
    form: { display: "flex", alignItems: "center", gap: 6 },
    searchInput: {
      width: 247, height: 22, borderRadius: 30,
      backgroundColor: color.Green[5], border: "none", padding: "14px 18px", outline: "none",
    },
    button: {
      backgroundColor: color.Green[50], width: 42, height: 42, border: "none", borderRadius: 21,
      display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
    },
  };

  const handleSubmit = (e) => { e.preventDefault(); onSubmit?.(); };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.searchInput}
          placeholder={label}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <button type="submit" style={styles.button} aria-label="검색">
          <img src={SearchBtn} alt="검색" />
        </button>
      </form>
    </div>
  );
}

export default SearchField;
