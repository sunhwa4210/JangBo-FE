import styles from "./BottomSheetStore.module.css";
import clock from "../../../assets/clock.svg";
import dayoff from "../../../assets/dayoff.svg";
import phone from "../../../assets/phone.svg";
import category from "../../../assets/category.svg";
import rate from "../../../assets/rate.svg";

export default function BottomSheetStore({ isOpen, onClose, store }) {
  if (!isOpen || !store) return null;
  console.log("store in BottomSheetStore:", store);

  return (
    // 오버레이 영역 클릭 시 바텀시트 닫힘
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()} // 바텀시트 내부 클릭 시 이벤트 버블링 막아서 닫힘 방지
      >
        <div className={styles.handle}></div>

        <div className={styles.title}>
          <h3>{store.storeName}</h3>
          <p>매일 들여오는 신선육!</p>
          {/* 추후 수정 */}
        </div>
        <hr />

        <div className={styles.contents}>
          <div className={styles.list}>
            <div className={styles.item}>
              <img src={clock} />
              <div>
                {store?.openTime} ~ {store?.closeTime}
              </div>
            </div>
            <div className={styles.item}>
              <img src={dayoff} />
              <div>{store?.dayOff?.join(", ") || "휴무일 없음"}</div>
            </div>
            <div className={styles.item}>
              <img src={phone} />
              <div>{store.storePhoneNumber}</div>
            </div>
            <div className={styles.item}>
              <img src={category} />
              <div>{store.category}</div>
            </div>
            <div className={styles.item}>
              <img src={rate} />
              <div>{store.rate}</div>
            </div>
          </div>
          <div className={styles.image}></div>
        </div>

        {/* <img src={store.storeImgUrl} /> */}
      </div>
    </div>
  );
}
