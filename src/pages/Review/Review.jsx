import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import styles from "./Review.module.css";
import http from "../../api/http";
import cart from "../../assets/cart-default.svg";
import icon from "../../assets/arrow-down.svg";
import Modal from "../MerchantOrder/TabContents/Modal";
import api from "../../api/api";

export default function Review({
  isOpen,
  onClose,
  titleMessage = "픽업이 완료되었습니다!",
  subtitleMessage = "주문한 상품은 잘 받으셨나요? 우리동네 전통시장의 활성화를 위해 리뷰도 꼭 남겨주세요 !",
  orderId,
}) {
  const [order, setOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${orderId}`);
        setOrder(res.data);
      } catch (error) {
        console.error("주문 불러오기 실패:", error);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleRatingChange = async (productId, value) => {
    try {
      await http.post("/api/reviews", {
        orderId: order.orderId,
        productId,
        rating: value,
      });
      console.log("별점 저장 성공");
    } catch (error) {
      if (error.response?.status === 409) {
        alert("이미 리뷰를 작성한 상품입니다.");
      } else {
        console.error("별점 저장 실패:", error);
      }
    }
  };

  if (!isOpen) return null;
  if (!order) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
          <p>로딩중...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* 오버레이 영역 클릭 시 바텀시트 닫힘 */}
      <div className={styles.overlay} onClick={onClose}>
        <div
          className={styles.sheet}
          onClick={(e) => e.stopPropagation()} // 바텀시트 내부 클릭 시 이벤트 버블링 막아서 닫힘 방지
        >
          <div className={styles.handle}></div>

          <h2>{titleMessage}</h2>
          <div className={styles.message}>{subtitleMessage}</div>
          <div className={styles.wrapper}>
            <div className={styles.date}>{order.orderDate}</div>
            <img src={icon} alt="arrow" />
          </div>

          {order.products.map((p) => (
            <div key={p.productId} className={styles.card}>
              <div className={styles.content}>
                <img src={p.imageUrl} className={styles.image} />

                <div className={styles.text}>
                  <div className={styles.name}>{p.productName}</div>
                  <div className={styles.store}>{p.storeName}</div>
                </div>
                <img src={cart} className={styles.cart} />
              </div>
              <StarRating
                onChange={(value) => handleRatingChange(p.productId, value)}
              />
            </div>
          ))}

          <div className={styles.subtext} onClick={() => setIsModalOpen(true)}>
            다음에 남기기
          </div>

          {/* 모달 */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="아직 리뷰를 다 쓰지 않았어요"
            message="남은 리뷰는 다음에 쓸까요?"
            cancel="마저 쓸게요"
            button="다음에 쓸게요"
            onConfirm={() => {
              setIsModalOpen(false);
              onClose(); // 바텀시트 닫기
            }}
          />
        </div>
      </div>
    </>
  );
}
