// src/App.jsx (또는 App.js)
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import RegisterStore from "./pages/MerchantManage/ManageStore/RegisterStore.jsx";
import MyStore from "./pages/MyStore/MyStore.jsx";
import MerchantOrder from "./pages/MerchantOrder/MerchantOrder.jsx";
import AddProduct from "./pages/MerchantManage/ManageProduct/AddProduct.jsx";
import EditProduct from "./pages/MerchantManage/ManageProduct/EditProduct.jsx";
import EditStore from "./pages/MerchantManage/ManageStore/EditStore.jsx";
import MerchantMy from "./pages/My/MerchantMypage.jsx";
import PickupComplete from "./pages/Review/PickUpComplete.jsx";
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
        <Route path="/signup" element={<SignupSelectRole />} />{" "}
        {/* 1단계: 타입 선택 */}
        <Route path="/signup/:role" element={<SignupForm />} />{" "}
        {/* 2단계: 폼 입력 */}
        <Route path="/signup/:role/success" element={<SignupSuccess />} />{" "}
        {/* 3단계: 완료 */}
        {/* 메인/기타 */}
        <Route path="/main" element={<Main />} />
        <Route path="/ai" element={<AiJangbo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my" element={<My />} />
        {/* 상점 세부 페이지 */}
        <Route path="/store/:storeId" element={<StorePage />} />
        {/* 상점 등록&수정 페이지 */}
        <Route path="/merchant/registerstore" element={<RegisterStore />} />
        <Route path="/merchant/editstore/:storeId" element={<EditStore />} />
        {/* 상인 메인 페이지 */}
        <Route path="/merchant/mystore/:storeId" element={<MyStore />} />
        {/* 상인 주문/픽업 페이지 */}
        <Route path="/merchant/order" element={<MerchantOrder />} />
        {/* 상품 등록&수정 페이지 */}
        <Route path="/merchant/addproduct" element={<AddProduct />} />
        <Route
          path="/merchant/editproduct/:productId"
          element={<EditProduct />}
        />
        {/* 상인 마이페이지 */}
        <Route path="/merchant/mypage" element={<MerchantMy />} />
        {/* 리뷰 페이지 */}
        <Route path="/review" element={<PickupComplete />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
