import { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet from "../../components/BottomSheet.jsx";
import StepTabs from "../../components/StepTabs.jsx";
import OrderLineItem from "./OrderLineItem.jsx";
import styles from "./OrderStatusSheet.module.css";
import { getOrderDetail, cancelOrder } from "../../api/orders";
import { useNavigate } from "react-router-dom";
import Down from "../../assets/down.svg";

const messages = {
  PAYMENT_REQUESTED: {
    title: "주문을 확인하고 있습니다",
    desc: "주문 수락 즉시 상품 준비가 시작됩니다.\n상품 준비 완료 후, 1시간 이내에 픽업해 주세요!",
    cta: { text: "주문 취소", role: "cancel" },
  },
  ORDER_CHECKING: {
    title: "상품을 준비하고 있습니다",
    desc: "주문을 수락하여 상품을 신속히 준비하고 있습니다.\n준비 완료 후, 1시간 이내에 픽업해 주세요!",
    cta: { text: "문의하기", role: "contact" },
  },
  ORDER_ACCEPTED: {
    title: "상품을 준비하고 있습니다",
    desc: "픽업 준비가 끝나면 알려드릴게요.\n1시간 내 픽업해 주세요!",
    cta: { text: "문의하기", role: "contact" },
  },
  READY_FOR_PICKUP: {
    title: "지금 픽업대에서 픽업해주세요!",
    desc: "1시간 이내에 찾아가지 않으면, 품질 문제로 폐기 처분될 수 있으며 결제 금액은 전액 환불되지 않습니다.",
    cta: { text: "픽업 QR", role: "qr" },
  },
};

const POLL_MS = 5000;

export default function OrderStatusSheet({ open, onClose, orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const timer = useRef();

  const stateKey = order?.status ?? "PAYMENT_REQUESTED";
  const view = messages[stateKey];

  // 폴링 (지수 백오프 간단 버전)
  useEffect(() => {
    if (!open || !orderId) return;
    let alive = true;
    let wait = POLL_MS;

    async function tick() {
      try {
        const data = await getOrderDetail(orderId);
        if (!alive) return;
        setOrder(data);
        setErr("");
        // 준비 완료되면 폴링 유지(위치표시/QR 갱신 등 필요시), 아니면 그대로
      } catch (e) {
        setErr(e?.response?.data?.message || "주문 정보를 불러오지 못했어요.");
        wait = Math.min(wait * 1.5, 20000);
      } finally {
        if (alive) timer.current = setTimeout(tick, wait);
      }
    }
    setLoading(true);
    tick().finally(() => setLoading(false));

    return () => {
      alive = false;
      clearTimeout(timer.current);
    };
  }, [open, orderId]);

  const items = useMemo(() => order?.items ?? [], [order]);
  const total = useMemo(() => order?.total ?? 0, [order]);

  // CTA 핸들
  const onCta = async () => {
    const role = messages[stateKey]?.cta?.role;
    if (role === "cancel") {
      if (!window.confirm("주문을 취소할까요?")) return;
      try {
        await cancelOrder(orderId);
        onClose?.();
      } catch (e) {
        alert(e?.response?.data?.message || "취소에 실패했습니다.");
      }
    } else if (role === "qr") {
      navigate(`/pay?orderId=${orderId}`, { state: { orderId } });
    } else if (role === "contact") {
      // TODO: 상점 전화/채팅 연결
      alert("상점에 문의해 주세요.");
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={order?.storeName}>
      <div className={styles.section}>
        <StepTabs current={stateKey} />

        <h2 className={styles.title}>{view.title}</h2>
        <p className={styles.desc}>
          {view.desc.split("\n").map((line, i) => <span key={i}>{line}<br/></span>)}
        </p>

        <div className={styles.orderBox}>
          <button className={styles.dropdown} aria-expanded="true">
            타이틀
            <div className={styles.arrow}><img src={Down} alt="down"/></div> 
          </button>

          <div className={styles.list}>
            {items.map((it) => <OrderLineItem key={it.itemId} item={it} />)}
          </div>

          <div className={styles.totalRow}>
            <span>총 결제 금액</span>
            <strong>{total.toLocaleString()}원</strong>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cta} onClick={onCta}>
            {view.cta.text}
          </button>
          {stateKey !== "READY_FOR_PICKUP" && (
            <button className={styles.secondary} onClick={onClose}>닫기</button>
          )}
        </div>

        {loading && <div className={styles.loading}>불러오는 중…</div>}
        {err && <div className={styles.error}>{err}</div>}
      </div>
    </BottomSheet>
  );
}
