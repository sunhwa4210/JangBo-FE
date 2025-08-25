import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import MenuBar from "../../components/MenuBar";
import { getCheckout } from "../../api/payments";
import styles from "./Pay.module.css";
import Down from "../../assets/down.svg";
import Right from "../../assets/right.svg";
const won = (v) => `${(v ?? 0).toLocaleString("ko-KR")}원`;

const METHODS = [
  { id: "card", label: "신용/체크카드" },
  { id: "meet", label: "만나서 결제" },
  { id: "kakao", label: "카카오페이" },
  { id: "naver", label: "네이버페이" },
];

export default function Pay() {
  const { state } = useLocation();
  const [sp] = useSearchParams();
  const orderId = state?.orderId || Number(sp.get("orderId"));

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // UI 상태
  const [method, setMethod] = useState(null);
  const [agree, setAgree] = useState(false);
  const canPay = !!method && agree && !!data;

  // 섹션 토글
  const [openItems, setOpenItems] = useState(true);
  const [openBuyer, setOpenBuyer] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const ck = await getCheckout(orderId);
        setData(ck);
      } catch (e) {
        setErr(e?.response?.data?.message || "결제 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const onPay = () => {
    if (!canPay) return;
    alert(`[DEMO] ${METHODS.find(m => m.id === method)?.label}로 결제 진행합니다.`);
  };

  return (
    <div className={styles.container}>
      <Header label="주문/결제" to="/cart" />

      {err && <div className={styles.errorBox}>{err}</div>}

      {loading ? (
        <div className={styles.skeleton}>불러오는 중…</div>
      ) : (
        <>
          {/* 주문 상품 */}
          <section className={styles.card}>
            <button
              type="button"
              className={styles.cardHeaderBtn}
              onClick={() => setOpenItems(v => !v)}
              aria-expanded={openItems}
            >
              <div className={styles.label}>주문 상품</div>
              <span className={styles.headerRight}>
                <span className={styles.orderTitle} title={data?.title || ""}>
                  {data?.title || ""}
                </span>
                <img
                  src={Down}
                  alt=""
                  className={`${styles.chevImg} ${openItems ? styles.chevOpen : ""}`}
                />
              </span>
            </button>

            {openItems && (
              <ul className={styles.itemList}>
                {data?.items?.map((it, i) => (
                  <li key={`${it.productId || i}`} className={styles.itemRow}>
                    <div className={styles.thumb}>
                      {it.imageUrl ? (
                        <img src={it.imageUrl} alt={it.productName} />
                      ) : (
                        <div className={styles.thumbPh} />
                      )}
                    </div>

                    <div className={styles.meta}>
                      <div className={styles.name}>{it.productName}</div>
                      <div className={styles.store}>{it.storeName}</div>
                      <div className={styles.price}>{won(it.price)}</div>
                    </div>

                    <div className={styles.qty}>{it.quantity}개</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 주문자 정보 */}
          <section className={styles.card}>
            <button
              type="button"
              className={styles.cardHeaderBtn}
              onClick={() => setOpenBuyer(v => !v)}
              aria-expanded={openBuyer}
            >
              <div className={styles.label}>주문자 정보</div>
              <span className={styles.headerRight}>
                <span className={styles.headerRightText}>{data?.customerName}</span>
                <img
                  src={Down}
                  alt=""
                  className={`${styles.chevImg} ${openBuyer ? styles.chevOpen : ""}`}
                />
              </span>
            </button>

            {openBuyer && (
              <div className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>주문한 시장</span>
                  <span className={styles.infoVal}>{data?.pickupMarket}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>이름</span>
                  <span className={styles.infoVal}>{data?.customerName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>이메일</span>
                  <span className={styles.infoVal}>{data?.email}</span>
                </div>
              </div>
            )}
          </section>

          {/* 결제금액 */}
          <section className={styles.card}>
            <div className={styles.cardHeader}><div className={styles.label}>결제 금액</div></div>
            <div className={styles.amounts}>
              <div className={styles.amountRow}>
                <span>주문금액</span>
                <b>{won(data?.orderAmount)}</b>
              </div>
              <div className={styles.amountRow}>
                <span>픽업 팁</span>
                <b>{won(data?.pickupTip)}</b>
              </div>
              <div className={`${styles.amountRow} ${styles.amountTotal}`}>
                <span>최종결제금액</span>
                <b>{won(data?.totalAmount)}</b>
              </div>
            </div>
          </section>

          {/* 결제수단 */}
          <section className={styles.card}>
            <div className={styles.cardHeader}><div className={styles.label}>결제 수단</div></div>
            <div className={styles.payGrid}>
              {METHODS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  className={`${styles.payBtn} ${method === m.id ? styles.payBtnActive : ""}`}
                  onClick={() => setMethod(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </section>

          {/* 필수 동의 */}
          <section className={styles.card}>
            <label className={styles.agreeRow}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)} 
                className={styles.cb}
              />
              <span className={styles.agreeText}>결제 진행 필수 동의</span>
            </label>

            <div className={styles.terms}>
              <div className={styles.termTitle}>
                개인정보 수집 · 이용 및 위탁 동의
                <span className={styles.chevSmall}><img src={Right} alt=">"></img></span>
              </div>
              <ul className={styles.termList}>
                <li>주문서에는 주문 처리와 결제에 필요한 정보만 포함됩니다.</li>
                <li>주문취소로 인한 환불은, 결제수단으로 환불됩니다.</li>
                <li>1시간 내 픽업 완료 안내를 위해, 식당·상점 사장님께 결제 승인 알림이 전송됩니다.</li>
              </ul>
            </div>
          </section>

          {/* 결제하기 고정 버튼 */}
          <div className={styles.payBarSpacer} />
          <div className={styles.payBar}>
            <button
              type="button"
              className={styles.payCta}
              disabled={!canPay}
              onClick={onPay}
            >
              결제하기
            </button>
          </div>
        </>
      )}

      <div className={styles.footer}><MenuBar /></div>
    </div>
  );
}
