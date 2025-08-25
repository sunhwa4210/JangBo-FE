import styles from "./OrderLineItem.module.css";

export default function OrderLineItem({ item }) {
  return (
    <div className={styles.row}>
      <div className={styles.thumb} aria-hidden="true" />
      <div className={styles.info}>
        <div className={styles.title}>{item.name}</div>
        <div className={styles.meta}>{item.option}</div>
      </div>
      <div className={styles.qty}>{item.quantity}개</div>
      <div className={styles.price}>{(item.price).toLocaleString()}원</div>
    </div>
  );
}
