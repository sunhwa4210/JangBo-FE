import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./StorePage.module.css";
import ProductList from "./components/ProductList.jsx";
import BottomSheetProduct from "./components/BottomSheetProduct.jsx";
import BottomSheetStore from "./components/BottomSheetStore.jsx";
import { getProducts, getStore, addCartItem } from "../../api/api.js";
import Header from "../../components/Header.jsx";
import MenuBar from "../../components/MenuBar.jsx";

const isValidStoreId = (id) =>
  typeof id === "string" &&
  id.trim() !== "" &&
  id !== "null" &&
  id !== "undefined" &&
  /^[0-9]+$/.test(id);

export default function StorePage() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [sort, setSort] = useState("recent");
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 상점 + 상품 데이터 불러오기 (유효 id만)
  useEffect(() => {
    // 유효하지 않으면 즉시 메인으로 이동(서버에 /stores/null 요청 방지)
    if (!isValidStoreId(storeId)) {
      navigate("/main", { replace: true });
      return;
    }

    const fetchProducts = async () => {
      try {
        // 상점 데이터
        const storeRes = await getStore(storeId);
        setStore(storeRes);

        // store 데이터 안의 merchantId 추출
        const merchantId = storeRes?.merchantId;
        if (!merchantId) {
          setProducts([]);
          return;
        }

        // 상품 데이터
        const productRes = await getProducts(merchantId, sort);
        setProducts(Array.isArray(productRes) ? productRes : []);
      } catch (err) {
        console.error("[StorePage] fetch error:", err);
      }
    };

    fetchProducts();
  }, [storeId, sort, navigate]);

  // 상점명(헤더) 클릭 시
  const handleStoreClick = () => setIsStoreOpen(true);

  // 상품 선택 시
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductOpen(true);
  };

  // 장바구니 추가
  const handleAddCart = async (product, quantity = 1) => {
    try {
      const res = await addCartItem(product.id, quantity);
      alert(res?.message ?? "장바구니에 담았습니다.");
      console.log(res);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400) alert("잘못된 요청입니다.");
      else if (status === 401) alert("로그인이 필요합니다.");
      else if (status === 404) alert("상품 또는 상점을 찾을 수 없습니다.");
      else alert("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(err);
    }
  };

  const count = products.length;

  if (!isValidStoreId(storeId)) return null;

  return (
    <>
      <Header
        label={store?.storeName ?? "상점"}
        onTitleClick={handleStoreClick}
        to="/main"
      />

      <div className={styles.topBar}>
        <div className={styles.count}>판매 상품 {count}개</div>
        <div className={styles.buttonContainer}>
          {["recent", "popular", "cheap", "fresh"].map((key) => (
            <button
              key={key}
              className={`${styles.button} ${sort === key ? styles.active : ""}`}
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

      <ProductList
        products={products}
        onProductClick={handleProductClick}
        handleAddCart={handleAddCart}
      />

      <BottomSheetProduct
        isOpen={isProductOpen}
        onClose={() => setIsProductOpen(false)}
        product={selectedProduct}
        onConfirm={(product, quantity) => handleAddCart(product, quantity)}
      />

      <BottomSheetStore
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        store={store}
      />

      <MenuBar />
    </>
  );
}
