import { useState } from "react";
import starEmpty from "../../assets/rate.svg";
import starFilled from "../../assets/Star 2.svg";
import styles from "./StarRating.module.css";

export default function StarRating({ onChange }) {
  const [rating, setRating] = useState(0);

  const handleClick = (index) => {
    const newRating = index + 1;
    setRating(newRating);
    if (onChange) onChange(newRating); // 부모 컴포넌트로 전달
  };

  return (
    <div className={styles.starContainer}>
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <img
            key={i}
            src={i < rating ? starFilled : starEmpty}
            className={styles.star}
            onClick={() => handleClick(i)}
            alt={`${i + 1}점`}
          />
        ))}
    </div>
  );
}
