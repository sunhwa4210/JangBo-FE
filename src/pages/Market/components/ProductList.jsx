import { products } from "../product.js";
//임시 더미데이터(상품)
import styles from "../MarketPage.module.css";

// props에서 products 배열을 받아서 사용
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
            <button className={styles.cartButton} onClick={()=> console.log(`${p.name} 장바구니 추가`)}></button>
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
