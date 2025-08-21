import { useState } from "react";
import styles from "./BottomSheetProduct.module.css";

export default function BottomSheetProduct({
  isOpen,
  onClose,
  product,
  onConfirm,
}) {
  const [quantity, setQuantity] = useState(1);
  if (!isOpen) return null;

  return (
    // 오버레이 영역 클릭 시 바텀시트 닫힘
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()} // 바텀시트 내부 클릭 시 이벤트 버블링 막아서 닫힘 방지
      >
        <div className={styles.handle}></div>

        <div className={styles.box}>
          <div className={styles.container}>
            <div
              className={styles.image}
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            ></div>

            <div className={styles.textContainer}>
              <div className={styles.title}>
                <h3>{product.name}</h3>
                <p className={styles.stock}>
                  최대 구매 수량: {product.stock}개
                </p>
              </div>

              <div className={styles.info}>
                <p className={styles.endDate}>
                  {" "}
                  {product.endDate}까지 <span>·</span> 원산지 {product.origin}
                </p>
              </div>

              <div className={styles.wrapper3}>
                <div className={styles.quantity}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <p className={styles.price}>
                  {product.price.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
          <button
            className={styles.confirmButton}
            onClick={() => {
              onConfirm(product, quantity); 
              onClose();
            }}
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
