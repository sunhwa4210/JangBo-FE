import styles from "./BottomSheet.module.css";
import clock from "../../../assets/clock.svg";
import dayoff from "../../../assets/dayoff.svg";
import phone from "../../../assets/phone.svg";
import category from "../../../assets/category.svg";
import rate from "../../../assets/rate.svg";

export default function BottomSheet({ isOpen, onClose, order }) {
  if (!isOpen) return null;

  return (
    // 오버레이 영역 클릭 시 바텀시트 닫힘
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()} // 바텀시트 내부 클릭 시 이벤트 버블링 막아서 닫힘 방지
      >
        <div className={styles.handle}></div>
        <div className={styles.title}>
          <div className={styles.name}>{order.customerName}</div>
          <div className={styles.price}>{order.totalPrice}</div>
        </div>
        <hr />
        <div className={styles.subtitle}>주문내역</div>

        <div className={styles.contents}>
          <div className={styles.list}>
            <div className={styles.item}>
              <div>{order.productName}</div>
              <div>{order.quantity}</div>
              <div>{order.price}</div>
            </div>
            <hr />
            <div className={styles.item}>
              <div>{order.productName}</div>
              <div>{order.quantity}</div>
              <div>{order.price}</div>
            </div>
            <hr />
            <div className={styles.item}>
              <div>{order.productName}</div>
              <div>{order.quantity}</div>
              <div>{order.price}</div>
            </div>
            <hr />

            <div className={styles.subtitle}>주문자 정보</div>
            <div className={styles.info}>
              <div>{order.customerName}</div>
              <div>{order.customerEmail}</div>
            </div>
            <hr />
            <div className={styles.subinfo}>
              <div>주문일시</div>
              <div>{order.orderDate}</div>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
}
