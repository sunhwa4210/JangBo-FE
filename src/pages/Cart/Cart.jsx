import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import Header from "../../components/Header";
import {
  fetchCart,
  fetchCartSummary,
  increaseCartItem,
  decreaseCartItem,
  deleteCartItem,
  deleteSelectedCartItems,
  clearCart,
} from "../../api/api";
import ManuBar from "../../components/MenuBar";
import styles from "./Cart.module.css";
import { createOrder } from "../../api/orders";       
import { createPaymentRequest } from "../../api/payments";
const won = (v) => `${(v ?? 0).toLocaleString("ko-KR")}원`;

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [summary, setSummary] = useState({ subtotal: 0, pickupFee: 0, total: 0 });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await fetchCart();
        const withCheck = (data.items ?? []).map((x) => ({ ...x, checked: true }));
        setItems(withCheck);
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

  const selectedIds = useMemo(
    () => items.filter((i) => i.checked).map((i) => i.itemId),
    [items]
  );
  const allChecked = useMemo(
    () => items.length > 0 && items.every((i) => i.checked),
    [items]
  );

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
      if (Array.isArray(data.items)) {
        setItems((prev) =>
          prev.map((p) => {
            const s = data.items.find((d) => d.itemId === p.itemId);
            return s ? { ...p, quantity: s.quantity, lineTotal: s.lineTotal } : p;
          })
        );
      }
    } catch (e) {
      console.warn("[summary] 실패", e.response?.status, e.response?.data);
    }
  }

  const toggleAll = () => {
    const next = !allChecked;
    setItems((prev) => prev.map((i) => ({ ...i, checked: next })));
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
    setItems((prev) =>
      prev.map((i) => (i.itemId === item.itemId ? { ...i, quantity: i.quantity - 1 } : i))
    );
    try {
      await decreaseCartItem(item.itemId);
      await refreshSummary();
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      setItems(backup);
      alert("비우기에 실패했습니다.");
    }
  };

const handleOrder = async () => {
  if (!selectedIds.length) return alert("선택된 상품이 없습니다.");

  try {
    // 1) 주문 생성
    const data = await createOrder(selectedIds);
    const orderId = data?.orderId || data?.order?.id || data?.id;
    if (!orderId) return alert("주문 ID를 확인할 수 없습니다.");

    // 2) 결제 요청(PENDING)
    await createPaymentRequest(orderId, "ACCOUNT_TRANSFER");

    // 3) 결제 페이지로 이동
    navigate(`/pay?orderId=${orderId}`, { state: { orderId } });
  } catch (e) {
    const code = e?.response?.status;
    if (code === 401) return alert("로그인이 필요합니다.");
    if (code === 409) return alert("이미 결제 요청이 진행 중입니다. 잠시 후 다시 시도해 주세요.");
    alert(e?.response?.data?.message || e?.message || "주문/결제 요청 중 오류가 발생했습니다.");
  }
};
  return (
    <div className={styles.page}>
      <Header label="장바구니" to="/main" />

      <div className={styles.topControls}>
        <div className={styles.checkboxLabel}>
          <input type="checkbox" className={styles.cb}  checked={allChecked} onChange={toggleAll} />
          <span className={styles.cbLabel} >모두 선택</span>
        </div>
        <div className={styles.topActions}>
          {/* 필요시 선택삭제 버튼 살리기: onClick={emptySelected} */}
          <button onClick={emptyAll} className={styles.textBtn}>비우기</button>
        </div>
      </div>

      <div className={styles.itemList}>
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

      <div className={styles.moreSection}>
        <button onClick={() => navigate("/main")} className={styles.moreBtn}>
          더 담으러 가기
        </button>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <div className={styles.summaryLabel}>주문금액</div>
          <div className={styles.summaryValue}>{won(summary.subtotal)}</div>
        </div>
        <div className={styles.summaryRow}>
          <div className={styles.summaryLabel}>픽업 팁</div>
          <div className={styles.summaryValue}>{won(summary.pickupFee)}</div>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          disabled={!selectedIds.length}
          onClick={handleOrder}
          className={`${styles.orderBtn} ${!selectedIds.length ? styles.orderBtnDisabled : ""}`}
        >
          <span className={styles.orderCount}>{selectedIds.length}</span>
          {won(summary.total)} 픽업 주문하기
        </button>
        <ManuBar />
      </div>
    </div>
  );
}
