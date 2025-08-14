import { products } from "../product.js";
import styles from "../MarketPage.module.css";

function ProductList() {
  return (
    <div className={styles.cardSection}>
      {products.map((p) => (
        <div key={p.id}>
          <div
            className={styles.cardImage}
            // 이미지 삽입 전
            style={{ backgroundImage: `url(${p.imageUrl})` }}
          >
            <button className={styles.cartButton}></button>
          </div>
          <div className={styles.cardName}>{p.name}</div>
          <div className={styles.cardPrice}>{p.price.toLocaleString()}원</div>
          <div className={styles.cardDate}>{p.endDate}까지</div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
