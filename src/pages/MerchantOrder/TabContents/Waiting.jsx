import { useState } from "react";
import Modal from "./Modal";
import OrderAcceptModal from "./OrderAcceptModal.jsx";
import styles from "./Waiting.module.css";
import http from "../../../api/http";
import BottomSheet from "./BottomSheet.jsx";

export default function Waiting({ orders, onRemove }) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false); // 주문 상세 바텀시트 열림 여부
  const [selectedOrder, setSelectedOrder] = useState(null); // 현재 선택된 주문

  const order = {
    customerName: "김슈니",
    orderDate: "2025-08-10 13:11:59",
    quantity: "1개",
    customerEmail: "swudam@gmail.com",
    productName: "샘표 진간장 500ml",
    price: "15,000원",
    totalPrice: "35,000원",
  };
  // 주문 취소
  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setIsCancelOpen(true); //취소 모달창
  };
  // 주문 수락
  const handleAcceptClick = (order) => {
    setSelectedOrder(order);
    setIsAcceptOpen(true); //수락 모달창
  };

  // 주문자 선택시
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsOrderOpen(true); //주문 상세 바텀시트
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
        <div key={order.orderId} className={styles.listbox} onClick={() => handleOrderClick(order)}>
          <div className={styles.title}>
            <div>{order.customerName}</div>
            <div>{order.totalPrice.toLocaleString()}원</div>
          </div>
          <div className={styles.time}>{order.orderDate}</div>
          <div className={styles.btnwrapper}>
            <button
              className={styles.cancel}
              onClick={(e) => e.stopPropagation(); handleCancelClick(order)}
            >
              주문 취소
            </button>
            <button
              className={styles.accept}
              onClick={(e) => e.stopPropagation(); handleAcceptClick(order)}
            >
              주문 수락
            </button>
          </div>
        </div>
      ))} */}
      <div className={styles.listbox} onClick={handleOrderClick}>
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

      {/* 주문상세 바텀시트 */}
      <BottomSheet
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        // order={selectedOrder} //데이터 연결시
        order={order}
      />

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
