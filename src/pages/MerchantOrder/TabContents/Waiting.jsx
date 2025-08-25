import { useState } from "react";
import Modal from "./Modal";
import OrderAcceptModal from "./OrderAcceptModal.jsx";
import styles from "./Waiting.module.css";
import http from "../../../api/http";

export default function Waiting({ orders, onRemove }) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // 현재 선택된 주문

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setIsCancelOpen(true);
  };

  const handleAcceptClick = (order) => {
    setSelectedOrder(order);
    setIsAcceptOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await http.post(`/api/orders/${selectedOrder.orderId}/cancel`, {
        reason: "사유 입력",
      });
      onRemove(selectedOrder.orderId);
    } catch (err) {
      console.error("취소 실패:", err);
    }
    setIsCancelOpen(false);
  };

  const handleConfirmAccept = async (time) => {
    try {
      await http.post(`/api/orders/${selectedOrder.orderId}/accept`, {
        prepareTime: time,
      });
      onRemove(selectedOrder.orderId);
    } catch (err) {
      console.error("수락 실패:", err);
    }
    setIsAcceptOpen(false);
  };

  /* 데이터 있을 시 주석 해제 */
  //   if (!orders || orders.length === 0) {
  //     return <p>대기 중인 주문이 없습니다.</p>;
  //   }

  return (
    <>
      {/* 데이터 있을 시 주석 해제 */}
      {/* {orders.map((order) => (
        <div key={order.orderId} className={styles.listbox}>
          <div className={styles.title}>
            <div>{order.customerName}</div>
            <div>{order.totalPrice.toLocaleString()}원</div>
          </div>
          <div className={styles.time}>{order.orderDate}</div>
          <div className={styles.btnwrapper}>
            <button
              className={styles.cancel}
              onClick={() => handleCancelClick(order)}
            >
              주문 취소
            </button>
            <button
              className={styles.accept}
              onClick={() => handleAcceptClick(order)}
            >
              주문 수락
            </button>
          </div>
        </div>
      ))} */}
      <div className={styles.listbox}>
        <div className={styles.title}>
          <div>김슈니</div>
          <div>18,800원</div>
        </div>
        <div className={styles.time}>2025-08-25 </div>
        <div className={styles.btnwrapper}>
          <button className={styles.cancel} onClick={() => handleCancelClick()}>
            주문 취소
          </button>
          <button className={styles.accept} onClick={() => handleAcceptClick()}>
            주문 수락
          </button>
        </div>
      </div>
      {/* 주문취소 모달 */}
      <Modal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        title="주문취소"
        cancel="취소"
        button="주문취소"
        inputField={
          <textarea
            className={styles.textarea}
            placeholder="취소 사유를 입력해주세요"
          />
        }
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsCancelOpen(false)}
      />

      {/* 주문수락 모달 */}
      <OrderAcceptModal
        isOpen={isAcceptOpen}
        onClose={() => setIsAcceptOpen(false)}
        onConfirm={handleConfirmAccept}
        orderNumber={selectedOrder?.orderId}
      />
    </>
  );
}
