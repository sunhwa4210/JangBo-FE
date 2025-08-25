import React from "react";
import StoreItem from "./StoreItem";
import { useNavigate } from "react-router-dom";

function StoreList({ stores, loading, error, onItemClick }) {
  const navigate = useNavigate();
  if (loading) return <div style={{ padding: 12 }}>불러오는 중…</div>;
  if (error) return <div style={{ padding: 12, color: "tomato" }}>에러: {error}</div>;
  if (!stores?.length) return <div style={{ padding: 12 }}>표시할 상점이 없어요.</div>;

  const getStoreId = (s) => s?.storeId ?? s?.id ?? s?.store_id ?? null;

  return (
    <div>
      {stores.map((s, i) => {
        const id = getStoreId(s);
        const handleClick = () => {
          if (!id) {
            console.warn("[StoreList] 상점 ID 없음 → 이동 취소:", s);
            return;              // ★ null/undefined면 절대 이동 금지
          }
          if (onItemClick) return onItemClick(s, id);
          navigate(`/stores/${id}`);
        };

        return (
          <StoreItem
            key={id ?? `${s?.storeName ?? "store"}-${i}`}
            store={s}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
}

export default StoreList;
