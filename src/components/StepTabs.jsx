import styles from "./StepTabs.module.css";

const STEPS = [
  { key: "PAYMENT_REQUESTED", label: "결제요청" },
  { key: "ORDER_CHECKING",    label: "주문 확인" },
  { key: "ORDER_ACCEPTED",    label: "주문 수락" },
  { key: "READY_FOR_PICKUP",  label: "준비 완료" },
];

export default function StepTabs({ current }) {
  const idx = Math.max(0, STEPS.findIndex(s => s.key === current));
  return (
    <div className={styles.wrap} role="tablist" aria-label="주문 진행 단계">
      <div className={styles.track}>
        <div className={styles.bar} style={{ width: `${(idx/(STEPS.length-1))*100}%` }} />
      </div>
      <div className={styles.tabs}>
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            role="tab"
            aria-selected={i === idx}
            className={`${styles.tab} ${i <= idx ? styles.active : ""}`}
          >
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
