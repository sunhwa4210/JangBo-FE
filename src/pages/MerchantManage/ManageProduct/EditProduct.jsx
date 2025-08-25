import styles from "./EditProduct.module.css";
import Header from "../../../components/Header.jsx";
import MerchantMenuBar from "../../../components/MerchantMenuBar.jsx";
import CustomButton from "../../../components/CustomButton.jsx";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import http from "../../../api/http.js";

export default function AddProduct() {
  const { productId } = useParams(); //URL에서 상품아이디 가져옴
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [soldOut, setSoldOut] = useState(false);
  const navigate = useNavigate();

  //기존 정보 세팅
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await http.get(`/api/merchants/products/${productId}`);
        setProduct(res.data);
        setName(res.data.name);
        setOrigin(res.data.origin);
        setExpiryDate(res.data.expiryDate);
        setStock(res.data.stock.toString());
        setPrice(res.data.price.toLocaleString()); // 화면에 콤마 표시
        setSoldOut(res.data.soldout);
        // if (res.data.imageUrl) setPreview(res.data.imageUrl);
      } catch (err) {
        console.error("상품 불러오기 실패", err);
      }
    }
    fetchProduct();
  }, [productId]);

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
  // imageFile; //file 객체 여부 확인

  // // 이미지 업로드
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setImageFile(file);

  //   if (file) {
  //     const previewUrl = URL.createObjectURL(file); // 브라우저에서 미리보기 URL 생성
  //     setPreview(previewUrl);
  //   }
  // };

  // 품절 처리 토글
  const handleSoldOut = async () => {
    try {
      const res = await http.patch(
        `/api/merchants/products/${productId}/sold-out`
      );
      console.log("품절 처리 성공:", res.data);

      setSoldOut(true);
      setStock("0");
    } catch (err) {
      console.error("품절 처리 실패:", err);
      alert("품절 처리 중 오류가 발생했습니다.");
    }
  };

  // API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      name,
      expiryDate,
      origin,
      stock: Number(stock),
      price: Number(price.replace(/,/g, "")),
    };

    try {
      if (soldOut) {
        // 품절 API 호출
        await http.patch(`/api/merchants/products/${productId}/sold-out`);
      } else {
        // 일반 수정
        const res = await http.patch(
          `/api/merchants/products/${productId}`,
          body,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("상품 수정 성공:", res.data);
        navigate(-1);
      }
    } catch (err) {
      console.error("상품 수정 실패", err.response?.data || err.message);
      alert("상품 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <Header label="상품 수정" defaultActive="product" />
      {/* 상품 이미지 업로드
      <div className={styles.imageSection}>
        <div className={styles.image}>
          {preview && (
            <img src={preview} className={styles.image} alt="상품 이미지" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="productImage"
          style={{ display: "none" }}
        />
        <label htmlFor="productImage" className={styles.imageButton}>
          이미지 변경하기
        </label>
      </div> */}
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
              placeholder="000,000원"
              value={price}
              onChange={(e) => setPrice(formatPrice(e.target.value))}
              className={styles.price}
            />
            원
          </div>
          {/* 품절 처리 버튼 */}
          <div className={styles.inputItem}>
            <input type="checkbox" checked={soldOut} onChange={handleSoldOut} />
            품절 처리하기
          </div>
        </div>

        <CustomButton
          label="수정"
          className={styles.donebutton}
          disabled={!isFormValid}
          type="submit"
        ></CustomButton>
      </form>
      <MerchantMenuBar />
    </div>
  );
}
