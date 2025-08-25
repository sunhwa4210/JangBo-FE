// src/App.js
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
import Pay from "./pages/Cart/Pay.jsx";

import StorePage from "./pages/Store/StorePage.jsx";
import My from "./pages/My/index.jsx";

// 상인/가게 관리
import RegisterStore from "./pages/MerchantManage/ManageStore/RegisterStore.jsx";
import EditStore from "./pages/MerchantManage/ManageStore/EditStore.jsx";
import MyStore from "./pages/MyStore/MyStore.jsx";
import MerchantOrder from "./pages/MerchantOrder/MerchantOrder.jsx";
import AddProduct from "./pages/MerchantManage/ManageProduct/AddProduct.jsx";
import EditProduct from "./pages/MerchantManage/ManageProduct/EditProduct.jsx";
import MerchantMy from "./pages/My/MerchantMypage.jsx";

// 리뷰
import PickupComplete from "./pages/Review/PickUpComplete.jsx";
//바텀시트 테스트
import OrderStatusSheetPlayground from "./pages/OrderStatusSheetPlayground.jsx";
// 숫자만 유효한 storeId 허용
const isValidStoreId = (id) =>
  typeof id === "string" && /^[0-9]+$/.test(id);

// 라우터 가드: 잘못된 storeId 접근 시 /main으로 리다이렉트
function StoreGuard() {
  const { storeId } = useParams();
  if (!isValidStoreId(storeId)) return <Navigate to="/main" replace />;
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

        {/* 상점 등록/수정 */}
        <Route path="/merchant/registerstore" element={<RegisterStore />} />
        <Route path="/merchant/editstore/:storeId" element={<EditStore />} />

        {/* 상인 영역 */}
        <Route path="/merchant/mystore/:storeId" element={<MyStore />} />
        <Route path="/merchant/order" element={<MerchantOrder />} />
        <Route path="/merchant/addproduct" element={<AddProduct />} />
        <Route path="/merchant/editproduct/:productId" element={<EditProduct />} />
        <Route path="/merchant/mypage" element={<MerchantMy />} />

        {/* 리뷰 */}
        <Route path="/review" element={<PickupComplete />} />

        <Route path="/play/order-sheet" element={<OrderStatusSheetPlayground />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
