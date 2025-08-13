import React, { useState } from "react";
import styles from "./MarketPage.module.css";
import Card from "./components/Cards.jsx";

export default function MarketPage({ label, active, onClick }) {
  const [activeSort, setActiveSort] = useState(0);
  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.count}>판매 상품 31개</div>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${active ? styles.active : ""}`}
            onClick={onClick}
            type="button"
          >
            최신순
          </button>
          <button
            className={`${styles.button} ${active ? styles.active : ""}`}
            onClick={onClick}
            type="button"
          >
            인기순
          </button>
          <button
            className={`${styles.button} ${active ? styles.active : ""}`}
            onClick={onClick}
            type="button"
          >
            저가순
          </button>
          <button
            className={`${styles.button} ${active ? styles.active : ""}`}
            onClick={onClick}
            type="button"
          >
            신선순
          </button>
        </div>
      </div>
      <Card />

      {/* <SortButton label="최신순" active={true} onClick={() => alert("클릭됨")} />
      <SortButton label="인기순" active={false} onClick={() => alert("클릭됨")} /> */}
    </>
  );
}
