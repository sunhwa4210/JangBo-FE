import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./MarketPage.module.css";
import ProductList from "./components/ProductList.jsx";
import axios from "axios";

export default function MarketPage() {
  const { merchantId } = useParams(); //URL에서 상점 ID 추출
  const [sort, setSort] = useState("recent"); //기본값 최신순
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/products/merchants/${merchantId}`, { params: { sort } })
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, [merchantId, sort]);

  const count=products.length; 

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.count}>판매 상품 {count}개</div>
        <div className={styles.buttonContainer}>
          {["recent","popular","cheap","fresh"].map(key => (
            <button
              key={key}
              className={`${styles.button} ${sort===key ? styles.active : ""}`}
              type="button"
              onClick={() => setSort(key)}
            >
              {key==="recent"?"최신순":key==="popular"?"인기순":key==="cheap"?"저가순":"신선순"}
            </button>
          ))}
        </div>
      </div>
      <ProductList products={products}/>
    </>
  );
}
