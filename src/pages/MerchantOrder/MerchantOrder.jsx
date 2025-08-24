import React, { useState } from "react";
import MerchantMenuBar from "../../components/MerchantMenuBar";
import Header from "../../components/Header";
import styles from "./MerchantOrder.module.css";
import Waiting from "./TabContents/Waiting";
import Progress from "./TabContents/Progress";
import Done from "./TabContents/Done";

function MerchantOrder() {
  const [activeTab, setActiveTab] = useState("waiting"); // 초기값: 대기

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
          {activeTab === "waiting" && <Waiting />}
          {activeTab === "progress" && <Progress />}
          {activeTab === "done" && <Done />}
        </div>
      </div>
      <MerchantMenuBar />
    </div>
  );
}

export default MerchantOrder;
