import styles from "./Modal.module.css";

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  inputField,
  onConfirm,
}) {
  if (!isOpen) return null;

  //props받는걸로 바꾸기
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{title}</div>
        {message && <div className={styles.content}>{message}</div>}
        {inputField && <div className={styles.input}>{inputField}</div>}
        <div className={styles.btnwrapper}>
          <button className={styles.cancel} onClick={onClose}>
            취소
          </button>
          <button className={styles.accept} onClick={onConfirm}>
            {title}
          </button>
        </div>
      </div>
    </div>
  );
}
