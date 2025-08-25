import React from "react";
import Ad from "../assets/ad.svg"
function AdsBanner(){
    return(
        <div
        style={{
            width: "375px",
            height: "78px",
            backgroundColor: "hsla(0, 0%, 65%, 1)"
        }}>
            <img src={Ad} alt="광고"/>
        </div>
    )
}
export default AdsBanner;