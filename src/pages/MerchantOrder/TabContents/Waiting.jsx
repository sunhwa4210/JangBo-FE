import { useState } from "react";
import Modal from "./Modal";
import styles from "./Waiting.module.css";

export default function Waiting() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancelClick = () => {
    setIsModalOpen(true); // 버튼 클릭 → 모달 열기
  };

  const handleClose = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleConfirmCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className={styles.listbox}>
        <div className={styles.title}>
          <div>슈담이</div>
          <div>21,800원</div>
        </div>
        <div className={styles.time}>2025-08-10 13:11:59</div>
        <div className={styles.btnwrapper}>
          <button className={styles.cancel} onClick={handleCancelClick}>
            주문 취소
          </button>
          <button className={styles.accept}>주문 수락</button>
        </div>
      </div>

      {/* 주문취소 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="주문취소"
        inputField={
          <textarea
            className={styles.textarea}
            placeholder="취소 사유를 입력해주세요"
          />
        }
        onConfirm={handleConfirmCancel}
        onCancel={handleClose}
      />
    </>
  );
}
