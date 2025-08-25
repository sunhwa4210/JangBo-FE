// src/pages/Cart/CartItem.jsx
import React from "react";

const won = (v) => `${(v ?? 0).toLocaleString("ko-KR")}원`;

export default function CartItem({
  item,             // { itemId, productName, storeName, unitPrice, quantity, lineTotal, imageUrl, checked }
  onToggle,
  onDecrease,
  onIncrease,
  onRemove,
}) {
  const styles = {
    row: { display: "flex", gap: 12, padding: "14px 16px", borderBottom: "1px solid #f0f0f0", alignItems: "center" },
    cb: { width: 20, height: 20 },
    thumb: { width: 56, height: 56, borderRadius: 8, background: "#eee", overflow: "hidden" },
    meta: { flex: 1, display: "flex", flexDirection: "column", gap: 6 },
    title: { fontSize: 14, fontWeight: 600 },
    store: { fontSize: 12, color: "#777" },
    qtyRow: { display: "flex", gap: 8, alignItems: "center" },
    qtyBtn: { width: 28, height: 28, borderRadius: 6, border: "1px solid #ddd", background: "#fff" },
    qtyVal: { minWidth: 20, textAlign: "center", fontSize: 13 },
    price: { width: 80, textAlign: "right", fontWeight: 700 },
    remove: { marginLeft: 8, fontSize: 12, color: "#e05555", cursor: "pointer" },
  };

  return (
    <div style={styles.row}>
      <input
        type="checkbox"
        checked={!!item.checked}
        onChange={() => onToggle(item)}
        style={styles.cb}
      />
      <div style={styles.thumb}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.productName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : null}
      </div>

      <div style={styles.meta}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={styles.title}>{item.productName}</div>
          <div style={styles.remove} onClick={() => onRemove(item)}>삭제</div>
        </div>
        <div style={styles.store}>{item.storeName}</div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={styles.qtyRow}>
            <button style={styles.qtyBtn} onClick={() => onDecrease(item)}>-</button>
            <div style={styles.qtyVal}>{item.quantity}</div>
            <button style={styles.qtyBtn} onClick={() => onIncrease(item)}>+</button>
          </div>
          <div style={styles.price}>{won(item.lineTotal ?? item.unitPrice * item.quantity)}</div>
        </div>
      </div>
    </div>
  );
}
