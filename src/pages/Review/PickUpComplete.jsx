import { useState } from "react";
import Review from "./Review";

export default function PickupComplete() {
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // 실제로는 주문 완료 후 받은 orderId를 써야 함
  const orderId = 1;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* 버튼 누르면 Review 바텀시트 열기 */}
      <button
        onClick={() => setIsReviewOpen(true)}
        style={{
          border: "none",
          display: "flex",
          width: "150px",
          height: "40px",
          background: "#268F3A",
          color: "#fff",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer,",
          borderRadius: "5px",
        }}
      >
        픽업 완료
      </button>

      {/* Review 바텀시트 */}
      <Review
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        orderId={orderId}
      />
    </div>
  );
}
