import styles from "./AddProduct.module.css";
import Header from "../../../components/Header.jsx";
import MerchantMenuBar from "../../../components/MerchantMenuBar.jsx";
import CustomButton from "../../../components/CustomButton.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import http from "../../../api/http.js";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const navigate = useNavigate();

  // 숫자만 남기고 쉼표 포맷팅하는 함수
  const formatPrice = (value) => {
    // 숫자만 추출
    const numericValue = value.replace(/[^0-9]/g, "");
    // 천 단위마다 콤마 추가
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  // 모든 값이 다 채워졌는지 검사
  const isFormValid =
    name.trim() &&
    origin.trim() &&
    expiryDate.trim() &&
    price.trim() &&
    stock.trim();

  // API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      name,
      expiryDate,
      origin,
      stock: Number(stock),
      price: Number(price.replace(/,/g, "")), //쉼표 제거 후 숫자 변환
    };

    try {
      const res = await http.post("/api/merchants/products", body, {
        headers: { "Content-Type": "application/json" }, // 명시적으로 추가
      });
      console.log("상품 등록 성공:", res.data);
      navigate("/merchant/mystore");
    } catch (err) {
      console.error("상품 등록 실패");
    }
  };

  return (
    <div>
      <Header label="새 상품 등록하기" to="" defaultActive="product" />

      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
          {/* 상품명 입력칸 */}
          <div className={styles.inputItem}>
            <label>상품명</label>
            <input
              type="text"
              placeholder="입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/*유통기한 입력칸 */}
          <div className={styles.inputItem}>
            <label>유통기한</label>
            <input
              type="text"
              placeholder="예) 2025-01-01"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          {/* 원산지 */}
          <div className={styles.inputItem}>
            <label>원산지</label>
            <input
              type="text"
              placeholder="입력해주세요"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          {/* 등록할 재고 입력칸 */}
          <div className={styles.inputItem}>
            <label>등록할 재고</label>
            <input
              type="text"
              placeholder="입력해주세요"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          {/* 가격 입력칸 */}
          <div className={styles.inputItem}>
            <label>가격</label>
            <input
              type="text"
              placeholder="000,000"
              value={price}
              onChange={(e) => setPrice(formatPrice(e.target.value))}
              className={styles.price}
            />
            원
          </div>
        </div>

        <CustomButton
          label="등록"
          className={styles.donebutton}
          disabled={!isFormValid}
          type="submit"
        ></CustomButton>
      </form>
      <MerchantMenuBar active="product" />
    </div>
  );
}
