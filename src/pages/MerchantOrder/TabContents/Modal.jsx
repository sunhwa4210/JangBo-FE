import styles from "./Modal.module.css";

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  cancel,
  button,
  inputField,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{title}</div>
        {message && <div className={styles.content}>{message}</div>}
        {inputField && <div className={styles.input}>{inputField}</div>}
        <div className={styles.btnwrapper}>
          <button className={styles.cancel} onClick={onClose}>
            {cancel}
          </button>
          <button className={styles.accept} onClick={onConfirm}>
            {button}
          </button>
        </div>
      </div>
    </div>
  );
}
