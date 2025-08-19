import React from "react";
import Mypage from "../assets/btnMypage.svg";
import Jangbo from "../assets/jangbo.svg";
import {color} from "../styles/color";
import {typo} from "../styles/typography";

function LogoHeader () {
const styles={
    container:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "1px solid #eee", 
        height: "50px",
        alignItems: "center",
        gap: "61px",
        padding: "0px 22px"
    },

    logo:{
        display: "flex",
        flexDirection:"row",
        alignItems:"center"
    },

    empty:{
        backgroundColor: color.Grey[5],
        width: "40px",
        height: "18px",
        borderRadius: "30px",
        fontSize: "8px",
        fontWeight: "600",
        padding: "6px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
}
return(
<div style={styles.container} >
<div><img src={Mypage} alt="마이"></img></div>
<div style={styles.logo}>
    <img src={Jangbo} alt="장보"></img>
    <div style={typo.subheadlineEmphasized}><span style={{ color: color.Green[50] }}>장보는</span>친구</div>
</div>
<div style={styles.empty}>비었어요</div>
</div>

    );
}
export default LogoHeader;