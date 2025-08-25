import React, { useEffect, useRef } from "react";
import styles from "./BottomSheet.module.css";

/**
 * BottomSheet
 * - props:
 *   - open: boolean             // 열림 여부
 *   - onClose: () => void       // 바깥 클릭/ESC 로 닫기
 *   - title?: string
 *   - children: ReactNode
 */
export default function BottomSheet({ open, onClose, title, children }) {
  const onBackdrop = (e) => {
    // 바깥(반투명 배경) 클릭 시만 닫힘
    if (e.target === e.currentTarget) onClose?.();
  };

  // 바텀시트 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`${styles.wrap} ${open ? styles.open : ""}`}
      onMouseDown={onBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.sheet}>
        <div className={styles.handle} />
        {title && (
          <div className={styles.header}>
            <span className={styles.title}>{title}</span>
            <button className={styles.close} onClick={onClose} aria-label="닫기">×</button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
