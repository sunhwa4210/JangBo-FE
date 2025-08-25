import React, { useState, useEffect } from "react";
import MerchantMenuBar from "../../components/MerchantMenuBar";
import Header from "../../components/Header";
import styles from "./MerchantOrder.module.css";
import Waiting from "./TabContents/Waiting";
import Progress from "./TabContents/Progress";
import Done from "./TabContents/Done";
import http from "../../api/http";

function MerchantOrder() {
  const [activeTab, setActiveTab] = useState("waiting");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await http.get("/api/merchants/orders");
        console.log("API 응답:", res.data);
        // res.data 자체가 배열
        const list = Array.isArray(res.data) ? res.data : [];
        setOrders(list);
      } catch (err) {
        console.error("주문 불러오기 실패:", err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  // 주문 삭제 (취소/수락 후 목록에서 제거)
  const removeOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
  };

  return (
    <div>
      <Header label="주문/픽업" />
      <div className={styles.wrap}>
        {/* 탭 헤더 */}
        <div className={styles.tablist}>
          <button
            className={`${styles.tab} ${
              activeTab === "waiting" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("waiting")}
          >
            대기
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "progress" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("progress")}
          >
            진행
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "done" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("done")}
          >
            완료
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className={styles.panel}>
          {activeTab === "waiting" && (
            <Waiting orders={orders} onRemove={removeOrder} />
          )}
          {activeTab === "progress" && <Progress orders={orders} />}
          {activeTab === "done" && <Done orders={orders} />}
        </div>
      </div>
      <MerchantMenuBar />
    </div>
  );
}

export default MerchantOrder;
