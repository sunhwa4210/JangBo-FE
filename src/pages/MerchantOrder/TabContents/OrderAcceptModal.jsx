import { useState } from "react";
import styles from "./OrderAcceptModal.module.css";

export default function OrderAcceptModal({ isOpen, onClose, onConfirm, orderNumber }) {
  const [selectedTime, setSelectedTime] = useState(30);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>주문수락</h3>

        <div className={styles.orderNumber}>
          <span className={styles.number}>{orderNumber}번</span> 으로 배정되었어요
        </div>

        <p className={styles.guide}>준비시간을 선택해주세요</p>

        <div className={styles.timeButtons}>
          {[5, 10, 20, 30].map((time) => (
            <button
              key={time}
              type="button"
              className={`${styles.timeBtn} ${selectedTime === time ? styles.active : ""}`}
              onClick={() => setSelectedTime(time)}
            >
              {time}분
            </button>
          ))}
        </div>

        <div className={styles.btnwrapper}>
          <button className={styles.cancel} onClick={onClose}>
            취소
          </button>
          <button
            className={styles.accept}
            onClick={() => {
              onConfirm(selectedTime);
              onClose();
            }}
          >
            주문 수락
          </button>
        </div>
      </div>
    </div>
  );
}
