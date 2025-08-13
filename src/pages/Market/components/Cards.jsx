import { products } from "../product.js";
import styles from "../MarketPage.module.css";

function Card() {
  return (
    <div className={styles.cardSection}>
      {products.map((p) => (
        <div key={p.id} className={styles.cardContainer}>
          <div
            className={styles.cardImage}
            style={{ backgroundImage: `url(${p.imageUrl})` }}
          ></div>
          <div className={styles.cardName}>{p.name}</div>
          <div className={styles.cardPrice}>{p.price.toLocaleString()}원</div>
          <div className={styles.cardDate}>{p.endDate}까지</div>
        </div>
      ))}
    </div>
  );
}

export default Card;
