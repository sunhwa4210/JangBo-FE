import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../assets/search.svg";
import Message from "../assets/message.svg";
import Cart from "../assets/cart.svg";
import SearchFocus from "../assets/search_focus.svg";
import MessageFocus from "../assets/message_focus.svg";
import CartFocus from "../assets/cart_focus.svg";

function ManuBar() {
  const navigate = useNavigate();
  const [active, setActive] = useState("");

  const styles = {
    bar: {
      position: "fixed",
      bottom: 0,
      height: 64,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      gap: 40,
      padding: "10px 80px",
      zIndex: 100,
    },
    item: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
    },
    icon: {
      width: 24,
      height: 24,
      display: "block",
      marginBottom: 6,
    },
    label: (isActive) => ({
      fontSize: 12,
      color: isActive ? "green" : "black",
      fontWeight: isActive ? "600" : "400",
    }),
  };

  return (
    <nav style={styles.bar} aria-label="하단 메뉴">
      {/* 홈 */}
      <div
        style={styles.item}
        onClick={() => {
          setActive("홈");
          navigate("/main");
        }}
      >
        <img
          src={active === "홈" ? SearchFocus : Search}
          alt="홈"
          style={styles.icon}
        />
        <span style={styles.label(active === "홈")}>홈</span>
      </div>

      {/* AI 장보 */}
      <div
        style={styles.item}
        onClick={() => {
          setActive("AI");
          navigate("/ai");
        }}
      >
        <img
          src={active === "AI" ? MessageFocus : Message}
          alt="AI 장보"
          style={styles.icon}
        />
        <span style={styles.label(active === "AI")}>AI 장보</span>
      </div>

      {/* 장바구니 */}
      <div
        style={styles.item}
        onClick={() => {
          setActive("장바구니");
          navigate("/cart");
        }}
      >
        <img
          src={active === "장바구니" ? CartFocus : Cart}
          alt="장바구니"
          style={styles.icon}
        />
        <span style={styles.label(active === "장바구니")}>장바구니</span>
      </div>
    </nav>
  );
}

export default ManuBar;
