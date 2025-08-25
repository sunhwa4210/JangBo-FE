import { useState } from "react";
import Modal from "./Modal";
import styles from "./Progress.module.css";


export default function Progress() {
  return (
    <>
      <div className={styles.listbox}>
        <div className={styles.info}>
          <div className={styles.number}>10번</div>
          <div className={styles.container}>
            <div className={styles.title}>
              <div>슈담이</div>
              <div>21,800원</div>
            </div>
            <div className={styles.timewrapper}>
              <div className={styles.time}>2025-08-10 13:11:59</div>
              <div className={styles.minute}>10분 남음</div>
            </div>
          </div>
        </div>
        <div className={styles.btnwrapper}>
          <button className={styles.done}>준비완료</button>
        </div>
      </div>
    </>
  );
}