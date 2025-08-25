import React from "react";
import styles from "./CartItem.module.css";
import Minus from "../../assets/minus.svg";
import Plus from "../../assets/plus.svg";
const won = (v) => `${(v ?? 0).toLocaleString("ko-KR")}원`;

export default function CartItem({
  item,            
  onToggle,
  onDecrease,
  onIncrease,
  onRemove,
}) {
  const lineTotal = item.lineTotal ?? ((item.unitPrice ?? 0) * (item.quantity ?? 1));

  return (
    <div className={styles.row}>
      <input
        type="checkbox"
        className={styles.cb}
        checked={!!item.checked}
        onChange={() => onToggle(item)}
      />

      <div className={styles.thumb}>
        {item.imageUrl && (
          <img className={styles.thumbImg} src={item.imageUrl} alt={item.productName} />
        )}
      </div>

      <div className={styles.meta}>
        <div className={styles.titleRow}>
          <div className={styles.title}>{item.productName}</div>
          <button type="button" className={styles.remove} onClick={() => onRemove(item)}>
            삭제
          </button>
        </div>

        <div className={styles.store}>{item.storeName}</div>

        <div className={styles.bottomRow}>
          <div className={styles.stepper}>
            <button type="button" onClick={() => onDecrease(item)} aria-label="수량 감소">-</button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => onIncrease(item)} aria-label="수량 증가">+</button>
          </div>

          <div className={styles.price}>{won(lineTotal)}</div>
        </div>
      </div>
    </div>
  );
}
