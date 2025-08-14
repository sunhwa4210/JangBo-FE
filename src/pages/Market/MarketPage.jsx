import React, { useState } from "react";
import styles from "./MarketPage.module.css";
import ProductList from "./components/ProductList.jsx";

export default function MarketPage() {
  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.count}>판매 상품 31개</div>
        <div className={styles.buttonContainer}>
         <button className={styles.button} type="button">최신순</button>
          <button className={styles.button} type="button">인기순</button>
          <button className={styles.button} type="button">저가순</button>
          <button className={styles.button} type="button">신선순</button>
        </div>
      </div>
      <ProductList />
    </>
  );
}
