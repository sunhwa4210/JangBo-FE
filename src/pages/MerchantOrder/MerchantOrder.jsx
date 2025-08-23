import React from "react";
import MerchantMenuBar from "../../components/MerchantMenuBar";
import Header from "../../components/Header";

function MerchantOrder() {
  return (
    <div>
      <Header label="주문/픽업" to="-1"/>
      주문/픽업 페이지
      <MerchantMenuBar />
    </div>
  );
}

export default MerchantOrder;
