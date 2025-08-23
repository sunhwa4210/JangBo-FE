import React from "react";
import StoreItem from "./StoreItem";

function StoreList({ stores, loading, error, onItemClick }) {
  if (loading) return <div style={{ padding: 12 }}>불러오는 중…</div>;
  if (error) return <div style={{ padding: 12, color: "tomato" }}>에러: {error}</div>;
  if (!stores?.length) return <div style={{ padding: 12 }}>표시할 상점이 없어요.</div>;

  return (
    <div>
      {stores.map((s, i) => (
        <StoreItem
          key={s.storeId ?? `${s.storeName}-${i}`}
          store={s}
          onClick={onItemClick ? () => onItemClick(s) : undefined}
        />
      ))}
    </div>
  );
}

export default StoreList;
