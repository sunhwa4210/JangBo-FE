import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./MarketPage.module.css";
import ProductList from "./components/ProductList.jsx";
import BottomSheetProduct from "./components/BottomSheetProduct.jsx";
import BottomSheetStore from "./components/BottomSheetStore.jsx";
//import { products } from "./product.js";
//import axios from "axios";
import { getProducts, getStore } from "../../api/api.js";

export default function MarketPage() {
  const { storeId } = useParams(); //URL에서 상점 ID 추출
  const [sort, setSort] = useState("recent"); //기본값 최신순
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //상품 선택 시
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductOpen(true);
  };

  //상품 데이터 불러오기(엔드포인트 확인)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts(storeId, sort);
        console.log("상품 데이터:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [storeId, sort]);

  //상점명(헤더) 클릭 시
  const handleStoreClick = () => {
    setIsStoreOpen(true);
  };

  //상점 데이터 불러오기
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await getStore(storeId);
        console.log("상점 데이터:", res.data);
        setStore(res.data.store);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStore();
  }, [storeId]);
  
  const count = products.length;

  return (
    <>
      {/* 중괄호 추가하기 */}
      <div className={styles.header} onClick={handleStoreClick}>
        store.storeName
      </div>
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
      <ProductList products={products} onProductClick={handleProductClick} />

      {/* 상품 바텀시트 */}
      <BottomSheetProduct
        isOpen={isProductOpen}
        onClose={() => setIsProductOpen(false)}
        product={selectedProduct}
        onConfirm={(product, quantity) => {
          console.log("장바구니 담김:", product, quantity);
          // 장바구니 state에 추가하기
          //setCartItems((prev) => [...prev, { ...product, quantity }]);
        }}
      />
      
      {/* 상점 바텀시트 */}
      <BottomSheetStore
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        store={store}
      />
    </>
  );
}
