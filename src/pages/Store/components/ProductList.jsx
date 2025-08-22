import styles from "./ProductList.module.css";

function ProductList({ products, onProductClick, handleAddCart }) {
  return (
    <div className={styles.listSection}>
      {products.map((p) => (
        <div key={p.id}>
          <div
            className={styles.image}
            onClick={() => onProductClick(p)} //상품 클릭 시 부모로 이벤트 전달
            style={{ backgroundImage: `url(${p.imageUrl})` }}
          >
            {/* //장바구니 버튼 */}
            <button
              className={styles.button}
              onClick={(e) => {
                e.stopPropagation();
                handleAddCart(p);
              }}
            ></button>
          </div>

          <div className={styles.contents}>
            <div>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.price}>{p.price.toLocaleString()}원</div>
              <div className={styles.date}>{p.expiryDate}까지</div>
            </div>

            {/* 재고 0개면 품절 표시 */}
            {p.stock === 0 && <div className={styles.soldout}>품절</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
