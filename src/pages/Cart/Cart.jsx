import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import Header from "../../components/Header";
import {
  fetchCart,
  fetchCartSummary,
  setCartItemQuantity,
  increaseCartItem,
  decreaseCartItem,
  deleteCartItem,
  deleteSelectedCartItems,
  clearCart,
} from "../../api/api";

const won = (v) => `${(v ?? 0).toLocaleString("ko-KR")}원`;

export default function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]); // 서버 스키마 그대로 + checked
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [summary, setSummary] = useState({ subtotal: 0, pickupFee: 0, total: 0 });

  // === 초기 로드 ===
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await fetchCart(); // { items, subtotal, pickupFee, total, ... }
        const withCheck = (data.items ?? []).map((x) => ({ ...x, checked: true }));
        setItems(withCheck);
        // 초기 합계는 서버 값 사용 (모두 선택 가정)
        setSummary({
          subtotal: data.subtotal ?? 0,
          pickupFee: data.pickupFee ?? 0,
          total: data.total ?? (data.subtotal ?? 0) + (data.pickupFee ?? 0),
        });
      } catch (e) {
        const status = e.response?.status;
        if (status === 401) setErr("로그인이 필요합니다.");
        else setErr(e?.response?.data?.message || e?.message || "장바구니를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // === 선택된 아이템 ID 배열 ===
  const selectedIds = useMemo(
    () => items.filter((i) => i.checked).map((i) => i.itemId),
    [items]
  );
  const allChecked = useMemo(
    () => items.length > 0 && items.every((i) => i.checked),
    [items]
  );

  // === 선택 변경/수량 변경 시 서버 요약 갱신 ===
  async function refreshSummary(ids = selectedIds) {
    if (!ids.length) {
      setSummary({ subtotal: 0, pickupFee: 0, total: 0 });
      return;
    }
    try {
      const data = await fetchCartSummary(ids);
      setSummary({
        subtotal: data.subtotal ?? 0,
        pickupFee: data.pickupFee ?? 0,
        total: data.total ?? 0,
      });
      // 서버에서 라인토탈 수정이 반영되어 오면(수량/가격변동 등) UI로 싱크
      if (Array.isArray(data.items)) {
        setItems((prev) =>
          prev.map((p) => {
            const s = data.items.find((d) => d.itemId === p.itemId);
            return s ? { ...p, quantity: s.quantity, lineTotal: s.lineTotal } : p;
            // checked 상태는 프론트 값 유지
          })
        );
      }
    } catch (e) {
      console.warn("[summary] 실패", e.response?.status, e.response?.data);
    }
  }

  // === 이벤트 핸들러 ===
  const toggleAll = () => {
    const next = !allChecked;
    setItems((prev) => prev.map((i) => ({ ...i, checked: next })));
    // 변경 직후 서버 요약 갱신
    const ids = next ? items.map((i) => i.itemId) : [];
    refreshSummary(ids);
  };

  const toggleOne = (item) => {
    setItems((prev) =>
      prev.map((i) => (i.itemId === item.itemId ? { ...i, checked: !i.checked } : i))
    );
    const nextIds = items
      .map((i) =>
        i.itemId === item.itemId ? (!item.checked ? i.itemId : null) : (i.checked ? i.itemId : null)
      )
      .filter(Boolean);
    refreshSummary(nextIds);
  };

  const dec = async (item) => {
    if ((item.quantity ?? 1) <= 1) return;
    // 낙관적
    setItems((prev) =>
      prev.map((i) => (i.itemId === item.itemId ? { ...i, quantity: i.quantity - 1 } : i))
    );
    try {
      await decreaseCartItem(item.itemId);
      await refreshSummary();
    } catch (e) {
      // 롤백
      setItems((prev) =>
        prev.map((i) => (i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i))
      );
      alert("수량 감소에 실패했습니다.");
    }
  };

  const inc = async (item) => {
    setItems((prev) =>
      prev.map((i) => (i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i))
    );
    try {
      await increaseCartItem(item.itemId);
      await refreshSummary();
    } catch (e) {
      setItems((prev) =>
        prev.map((i) => (i.itemId === item.itemId ? { ...i, quantity: i.quantity - 1 } : i))
      );
      alert("수량 증가에 실패했습니다.");
    }
  };

  const removeOne = async (item) => {
    const backup = items;
    setItems((prev) => prev.filter((i) => i.itemId !== item.itemId));
    try {
      await deleteCartItem(item.itemId);
      await refreshSummary();
    } catch (e) {
      setItems(backup);
      alert("삭제에 실패했습니다.");
    }
  };

  const emptySelected = async () => {
    if (!selectedIds.length) return alert("선택된 항목이 없습니다.");
    const backup = items;
    setItems((prev) => prev.filter((i) => !selectedIds.includes(i.itemId)));
    try {
      await deleteSelectedCartItems(selectedIds);
      await refreshSummary([]);
    } catch (e) {
      setItems(backup);
      alert("선택 삭제에 실패했습니다.");
    }
  };

  const emptyAll = async () => {
    const backup = items;
    setItems([]);
    try {
      await clearCart();
      setSummary({ subtotal: 0, pickupFee: 0, total: 0 });
    } catch (e) {
      setItems(backup);
      alert("비우기에 실패했습니다.");
    }
  };

  const handleOrder = () => {
    if (!selectedIds.length) return alert("선택된 상품이 없습니다.");
    // TODO: 주문 생성 API 연동
    alert(`선택 ${selectedIds.length}개, 결제금액 ${won(summary.total)}로 주문 진행`);
  };

  // === 렌더 ===
  if (loading) return <div style={{ padding: 16 }}>불러오는 중…</div>;
  if (err) return <div style={{ padding: 16, color: "tomato" }}>{err}</div>;

  return (
    <div>
      {/* 헤더 */}
        <Header label="장바구니" to="/main"/>

      {/* 상단 컨트롤 */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={allChecked} onChange={toggleAll} />
          <span>모두 선택</span>
        </label>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={emptySelected} style={{ color: "#888", background: "none", border: "none" }}>선택삭제</button>
          <button onClick={emptyAll} style={{ color: "#888", background: "none", border: "none" }}>비우기</button>
        </div>
      </div>

      {/* 아이템 리스트 */}
      <div>
        {items.map((it) => (
          <CartItem
            key={it.itemId}
            item={it}
            onToggle={toggleOne}
            onDecrease={dec}
            onIncrease={inc}
            onRemove={removeOne}
          />
        ))}
      </div>

      {/* 더 담으러 가기 */}
      <div style={{ padding: 16, textAlign: "center", color: "#888", borderTop: "8px solid #f7f7f7" }}>
        <button
          onClick={() => navigate("/main")}
          style={{ border: "1px solid #eee", background: "#fff", padding: "10px 16px", borderRadius: 10 }}
        >
          더 담으러 가기
        </button>
      </div>

      {/* 합계 영역 (서버 요약 값 사용) */}
      <div style={{ padding: 16, background: "#f5faef", borderTop: "1px solid #e8f0e0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div>주문금액</div>
          <div style={{ fontWeight: 700 }}>{won(summary.subtotal)}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>픽업 팁</div>
          <div style={{ fontWeight: 700 }}>{won(summary.pickupFee)}</div>
        </div>
      </div>

      {/* 하단 주문 버튼 */}
      <div style={{ position: "sticky", bottom: 0, padding: 16, background: "#fff", borderTop: "1px solid #eee" }}>
        <button
          disabled={!selectedIds.length}
          onClick={handleOrder}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: selectedIds.length ? "#21a040" : "#cfe8d6",
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          <span style={{
            display: "inline-block",
            width: 22, height: 22, lineHeight: "22px",
            borderRadius: 11, background: "rgba(255,255,255,.2)",
            marginRight: 8, fontSize: 12, textAlign: "center"
          }}>
            {selectedIds.length}
          </span>
          {won(summary.total)} 픽업 주문하기
        </button>
      </div>
    </div>
  );
}
