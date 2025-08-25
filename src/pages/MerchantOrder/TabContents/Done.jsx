import { useState } from "react";
import Modal from "./Modal";
import styles from "./Done.module.css";

export default function Done() {
  return (
    <>
      <div className={styles.listbox}>
        <div className={styles.title}>
          <div>슈담이</div>
          <div>21,800원</div>
        </div>
        <div className={styles.time}>2025-08-10 13:11:59</div>
      </div>
    </>
  );
}
