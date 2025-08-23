import React from "react";
import ManuBar from "../../components/MenuBar";
import Header from "../../components/Header";
function Cart(){
return(
    <div>
        <Header label="장바구니" to="/main"/>
        장바구니 페이지
         <ManuBar/>
    </div>
)
}

export default Cart;
