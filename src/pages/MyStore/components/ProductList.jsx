import styles from "./ProductList.module.css";
import { products } from "../product";
import editBtn from "../../../assets/editbtn.svg";
import deleteBtn from "../../../assets/deletebtn.svg";
import { useNavigate } from "react-router-dom";

function ProductList({ products, handleDelete }) {
  const navigate = useNavigate();

  return (
    <div className={styles.listSection}>
      {products.map((p) => (
        // null 값 그대로 쓰지 않도록 조건부 처리 
        <div key={p.id}>
          <div
            className={styles.image}
            style={{
              backgroundImage: p.imageUrl ? `url(${p.imageUrl})` : "none",
            }} 
          >
            {/* 수정 버튼 */}
            <button
              className={styles.editbtn}
              style={{ backgroundImage: `url(${editBtn})` }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/merchant/editproduct/${p.id}`);
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
              <div className={styles.date}>원산지: {p.origin}</div>
              <div className={styles.date}>재고: {p.stock}개</div>
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
