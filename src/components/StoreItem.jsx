// src/components/StoreItem.jsx
import React from "react";
import Star from "../assets/Star 2.svg";
import { typo } from "../styles/typography";
import Right from "../assets/right.svg";

function StoreItem({ store, onClick }) {
  const styles = {
    container: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 22px",
      borderBottom: "solid 1px hsla(0, 0%, 95%, 1)",
      cursor: onClick ? "pointer" : "default",
    },
    left: { display: "flex", flexDirection: "row", gap: 20 },
    imageWrap: { width: 50, height: 50, backgroundColor: "#eee", borderRadius: 8, overflow: "hidden" },
    description: { display: "flex", flexDirection: "column", gap: 4 },
    name: { ...typo.footnoteEmphasized, fontWeight: 600, fontSize: 14 },
    starRow: { display: "flex", alignItems: "center", gap: 4 },
    subRow: { ...typo.caption2, display: "flex", gap: 8, fontSize: 12 },
    score: { ...typo.caption2Emphasized },
    img: { width: "100%", height: "100%", objectFit: "cover" },
    placeholder: { width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#aaa", fontSize: 12 },
  };

  const rating = store?.rating ?? null;

  return (
    <div style={styles.container} onClick={onClick}>
      <div style={styles.left}>
        <div style={styles.imageWrap}>
          {store?.storeimgUrl ? (
            <img src={store.storeimgUrl} alt={store?.storeName ?? "상점"} style={styles.img} />
          ) : (
            // 필요하면 기본 이미지: <img src="/default-store.png" ... />
            <div style={styles.placeholder}>이미지 없음</div>
          )}
        </div>

        <div style={styles.description}>
          <div style={styles.name}>{store?.storeName ?? "상점"}</div>

          {rating != null && (
            <div style={styles.starRow}>
              <img src={Star} alt="별" width={12} height={12} />
              <div style={styles.score}>{Number(rating).toFixed(1)}</div>
            </div>
          )}

          <div style={styles.subRow}>
            <div className="time">
              {(store?.openTimeShort || store?.openTime?.slice(0, 5) || "")}
              {"~"}
              {(store?.closeTimeShort || store?.closeTime?.slice(0, 5) || "")}
            </div>
            <div className="category">{store?.category}</div>
          </div>
        </div>
      </div>
      <img src={Right} alt="더보기" width={24} height={24} />
    </div>
  );
}

export default StoreItem;
