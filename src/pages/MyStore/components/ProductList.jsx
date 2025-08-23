import styles from "./ProductList.module.css";
import { products } from "../product";
import editBtn from "../../../assets/editbtn.svg";
import deleteBtn from "../../../assets/deletebtn.svg";

function ProductList({ products, handleDelete }) {
  return (
    <div className={styles.listSection}>
      {products.map((p) => (
        <div key={p.id}>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${p.imageUrl})` }}
          >
            {/* 수정 버튼 */}
            <button
              className={styles.editbtn}
              style={{ backgroundImage: `url(${editBtn})` }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            ></button>
            {/* 삭제 버튼 */}
            <button
              className={styles.deletebtn}
              style={{ backgroundImage: `url(${deleteBtn})` }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(p.id);
              }}
            ></button>
          </div>

          <div className={styles.contents}>
            <div>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.price}>{p.price.toLocaleString()}원</div>
              <div className={styles.date}>{p.expiryDate}까지</div>
              <div className={styles.date}>{p.stock}까지</div>
              <div className={styles.date}>{p.origin}까지</div>
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
