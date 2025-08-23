import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./MyStore.module.css";
import ProductList from "./components/ProductList.jsx";
import BottomSheetStore from "./components/BottomSheetStore.jsx";
import Header from "../../components/Header.jsx";
import MerchantMenuBar from "../../components/MerchantMenuBar.jsx";
import axios from "axios";

export default function MyStore() {
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 5000,
    withCredentials: true,
  });

  // 상품 API
  const getProducts = async (sort) => {
    const res = await api.get("/api/merchants/products", {
      params: { sort },
    });
    return res.data;
  };

  const { storeId } = useParams(); //URL에서 상점 ID 추출
  const [sort, setSort] = useState("recent"); //기본값 최신순
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const navigate = useNavigate();

  //상품 데이터 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        //상품 데이터
        const productRes = await getProducts(sort);
        setProducts(productRes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [sort]);

  //상점명(헤더) 클릭 시
  const handleStoreClick = () => {
    setIsStoreOpen(true);
  };

  //상품 삭제
  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/api/merchants/products/${productId}`);
      // 성공하면 로컬 상태에서 상품 제거
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("상품이 삭제되었습니다.");
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        alert("상품을 찾을 수 없습니다.");
      } else if (status === 401) {
        alert("로그인이 필요합니다.");
      } else {
        alert("삭제 중 오류가 발생했습니다.");
      }
      console.error(err);
    }
  };
  // 주문 픽업 버튼 클릭 시 페이지 이동
  const handleButtonClick = () => {
    navigate("/merchant/order");
  };
  const count = products.length;

  return (
    <>
      <Header
        label={store?.storeName}
        onTitleClick={handleStoreClick}
        button={
          <button
            style={{
              border: "none",
              width: "53px",
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: "30px",
              boxSizing: "border-box",
              color: "#fff",
              fontSize: "8px",
              fontWeight: "600",
              background: "#268F3A",
            }}
            onClick={handleButtonClick}
          >
            주문/픽업
          </button>
        }
      />
      <div className={styles.topBar}>
        <div className={styles.count}>판매 상품 {count}개</div>
        <div className={styles.buttonContainer}>
          {["recent", "popular", "cheap", "fresh"].map((key) => (
            <button
              key={key}
              className={`${styles.button} ${
                sort === key ? styles.active : ""
              }`}
              type="button"
              onClick={() => setSort(key)}
            >
              {key === "recent"
                ? "최신순"
                : key === "popular"
                ? "인기순"
                : key === "cheap"
                ? "저가순"
                : "신선순"}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 목록 컴포넌트에 product데이터&클릭이벤트 전달 */}
      <ProductList products={products} onDelete={handleDeleteProduct} />

      {/* 상점 바텀시트 */}
      <BottomSheetStore
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        store={store}
      />

      <MerchantMenuBar defaultActive="home" />
    </>
  );
}
