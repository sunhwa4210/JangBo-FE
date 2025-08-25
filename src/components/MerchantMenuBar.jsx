import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import edit from "../assets/edit.svg";
import home from "../assets/merchant-home.svg";
import product from "../assets/product.svg";
import editFocus from "../assets/editFocus.svg";
import homeFocus from "../assets/merchant-homeFocus.svg";
import productFocus from "../assets/productFocus.svg";

function MerchantMenuBar({ defaultActive = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeId } = useParams(); //URL에서 storeId 꺼내오기
  // const [active, setActive] = useState(defaultActive);

  const active = location.pathname.startsWith("/merchant/editstore")
    ? "edit"
    : location.pathname.startsWith("/merchant/mystore") ||
      location.pathname.startsWith("/merchant/editproduct")
    ? "home"
    : location.pathname.startsWith("/merchant/addproduct")
    ? "product"
    : null;

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
      backgroundColor: "white",
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
    span: {
      margin: 0,
    },
    label: (isActive) => ({
      fontSize: 12,
      color: isActive ? "green" : "black",
      fontWeight: isActive ? "600" : "400",
      margin: 0,
    }),
  };

  return (
    <nav style={styles.bar} aria-label="하단 메뉴">
      {/* 상점 관리 */}
      <div
        style={styles.item}
        onClick={() => {
          // setActive("edit");
          navigate(`/merchant/editstore/${storeId}`);
        }}
      >
        <img
          src={active === "edit" ? editFocus : edit}
          alt="상점 관리"
          style={styles.icon}
        />
        <span style={styles.label(active === "edit")}>상점 관리</span>
      </div>

      {/* 홈 */}
      <div
        style={styles.item}
        onClick={() => {
          // setActive("home");
          navigate(`/merchant/mystore/${storeId}`);
        }}
      >
        <img
          src={active === "home" ? homeFocus : home}
          alt="홈"
          style={styles.icon}
        />
        <span style={styles.label(active === "home")}>홈</span>
      </div>

      {/* 새 상품 등록 */}
      <div
        style={styles.item}
        onClick={() => {
          // setActive("product");
          navigate("/merchant/addproduct");
        }}
      >
        <img
          src={active === "product" ? productFocus : product}
          alt="새 상품 등록 "
          style={styles.icon}
        />
        <span style={styles.label(active === "product")}>새 상품 등록 </span>
      </div>
    </nav>
  );
}

export default MerchantMenuBar;
