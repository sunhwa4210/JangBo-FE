import { products } from "../product.js";
//임시 더미데이터(상품)
import styles from "./ProductList.module.css";

//api 연결 시  {products, onProductClick}로 수정
function ProductList({ onProductClick }) {
  return (
    <div className={styles.listSection}>
      {products.map((p) => (
        <div key={p.id}>
          <div
            className={styles.image}
            onClick={() => onProductClick(p)} //상품 클릭 시 부모로 이벤트 전달
            // 이미지 삽입 전
            style={{ backgroundImage: `url(${p.imageUrl})` }}
          >
            <button
              className={styles.button}
              onClick={(e) => {
                e.stopPropagation();
                console.log(`${p.name} 장바구니 추가`);
              }}
            ></button>
          </div>

          <div className={styles.contents}>
            <div>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.price}>{p.price.toLocaleString()}원</div>
              <div className={styles.date}>{p.endDate}까지</div>
            </div>

            <div className={styles.soldout}>품절</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
