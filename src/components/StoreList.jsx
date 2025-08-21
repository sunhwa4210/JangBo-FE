import React from "react";
import Star from "../assets/Star 2.svg"; 
import {typo} from "../styles/typography";
import Right from "../assets/right.svg";
function StoreList() {
  const styles = {
    container: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      justifyContent: "space-between",
      padding:"12px 22px",
      borderBottom:"solid 1px hsla(0, 0%, 95%, 1)"
    },
    left: {
        display: "flex",
        flexDirection: "row",
        gap: "20px"
,    },
    image: {
      width: 50,
      height: 50,
      backgroundColor: "#eee",
      borderRadius: 8,
    },
    description: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
    },
    name: {
        ...typo.footnoteEmphasized,
      fontWeight: 600,
      fontSize: 14,
    },
    starRow: {
      display: "flex",
      alignItems: "center",
      gap: 4,
    },
    subRow: {
      ...typo.caption2,
      display: "flex",
      gap: 8,
      fontSize: 12,
    },
    score:{
        ...typo.caption2Emphasized,
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
      <div style={styles.image} />
      <div style={styles.description}>
        <div style={styles.name}>정다운 장터</div>
        <div style={styles.starRow}>
          <img src={Star} alt="별" width={12} height={12} />
          <div style={styles.score}>4.7</div>
        </div>
        <div style={styles.subRow}>
          <div className="time">9:00~18:00</div>
          <div className="category">정육·계란</div>
        </div>
      </div>
      </div>  
      <img src={Right} alt="더보기" width={24} height={24}/>
    </div>
  );
}

export default StoreList;
