import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./StorePage.module.css";
import ProductList from "./components/ProductList.jsx";
import BottomSheetProduct from "./components/BottomSheetProduct.jsx";
import BottomSheetStore from "./components/BottomSheetStore.jsx";
import { getProducts, getStore } from "../../api/api.js";
import Header from "../../components/Header.jsx";

export default function MarketPage() {
  const { storeId } = useParams(); //URL에서 상점 ID 추출
  const [sort, setSort] = useState("recent"); //기본값 최신순
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //상점+상품 데이터 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("fetchData 실행 storeId:", storeId, "sort:", sort);

        //상점 데이터
        const storeRes = await getStore(storeId);
        console.log("상점 데이터:", storeRes);
        setStore(storeRes.store);

        //storeRes 안의 merchantId 추출
        const merchantId = storeRes.merchantId;
        console.log("merchantId:", merchantId);

        //상품 데이터
        const productRes = await getProducts(merchantId, sort);
        console.log("상품 데이터:", productRes);
        setProducts(productRes);
      } catch (err) {
        console.error(err);
      }
    };
    //storeId 있을때만 api 호출하도록
    if (storeId) {
      fetchProducts();
    }
  }, [storeId, sort]);

  //상점명(헤더) 클릭 시
  const handleStoreClick = () => {
    setIsStoreOpen(true);
  };

  //상품 선택 시
  const handleProductClick = (product) => {
    console.log("선택한 상품:", product);
    setSelectedProduct(product);
    setIsProductOpen(true);
  };

  const count = products.length;

  return (
    <>
      {/* 경로명 맞게 수정, {store?.storeName}으로 수정 */}
      {/* <Header label={store.storeName} to="/home" onTitleClick={handleStoreClick} />   */}
      <Header
        label="정다운 장터"
        to="/home"
        onTitleClick={handleStoreClick}
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
