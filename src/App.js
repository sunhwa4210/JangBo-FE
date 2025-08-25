import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import "./App.css";

import Splash from "./pages/Splash/index.jsx";
import SignupSelectRole from "./pages/Signup/SignupSelectRole.jsx";
import SignupForm from "./pages/Signup/SignupForm.jsx";
import SignupSuccess from "./pages/Signup/SignupSuccess.jsx";
import Login from "./pages/Login/index.jsx";
import Main from "./pages/Main/Main.jsx";
import AiJangbo from "./pages/AI/AiJangbo.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import StorePage from "./pages/Store/StorePage.jsx";

import My from "./pages/My/index.jsx";
import RegisterStore from "./pages/RegisterStore/RegisterStore.jsx";
import MyStore from "./pages/MyStore/MyStore.jsx";
import MerchantOrder from "./pages/MerchantOrder/MerchantOrder.jsx";
import Pay from "./pages/Cart/Pay.jsx";

// 숫자만 유효한 storeId로 허용
const isValidStoreId = (id) =>
  typeof id === "string" && /^[0-9]+$/.test(id);

// 라우터 가드
function StoreGuard() {
  const { storeId } = useParams();
  if (!isValidStoreId(storeId)) {
    return <Navigate to="/main" replace />;
  }
  return <StorePage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 리다이렉트 */}
        <Route path="/" element={<Navigate to="/splash" replace />} />

        {/* 인증/온보딩 */}
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        {/* 회원가입 단계별 페이지 */}
        <Route path="/signup" element={<SignupSelectRole />} />
        <Route path="/signup/:role" element={<SignupForm />} />
        <Route path="/signup/:role/success" element={<SignupSuccess />} />

        {/* 메인/기타 */}
        <Route path="/main" element={<Main />} />
        <Route path="/ai" element={<AiJangbo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/my" element={<My />} />

        {/* 상점 상세 (가드 적용) */}
        <Route path="/stores/:storeId" element={<StoreGuard />} />

        {/* 상인 영역 */}
        <Route path="/merchant/registerstore" element={<RegisterStore />} />
        <Route path="/merchant/mystore" element={<MyStore />} />
        <Route path="/merchant/order" element={<MerchantOrder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
