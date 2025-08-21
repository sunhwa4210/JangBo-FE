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
import RegisterStore from "./pages/RegisterStore/RegisterStore.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />

        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        {/* 회원가입 단계별 페이지 */}
        <Route path="/signup" element={<SignupSelectRole />} />        {/* 1단계: 타입 선택 */}
        <Route path="/signup/:role" element={<SignupForm />} />        {/* 2단계: 폼 입력 */}
        <Route path="/signup/:role/success" element={<SignupSuccess />} /> {/* 3단계: 완료 */}

        {/* 메인/마켓/기타 페이지 */}
        <Route path="/main" element={<Main />} />
        <Route path="/ai" element={<AiJangbo />} />
        <Route path="/cart" element={<Cart />} />

        {/* 스토어 상세 */}
        <Route path="/store/:storeId" element={<StorePage />} />
        {/* 상점 세부 페이지 */}
        <Route path="/merchant/registerstore" element={<RegisterStore />} />
        {/* 상점 등록 페이지 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
