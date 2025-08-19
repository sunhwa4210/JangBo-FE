import React from "react";
import BackIcon from "../assets/back.svg"
import { useNavigate } from "react-router-dom";


function Header ({label, to}){
    const navigate= useNavigate();
    const styles = {
    container: {
    display: "flex",
    alignItems: "center",
    height: "50px",
    padding: "0 16px",
    position: "relative", 
    borderBottom: "1px solid #eee", 
    },

  backIcon: {
    position: "absolute",
    left: "16px", 
    cursor: "pointer",
  },

  title: {
    margin: "0 auto",
    fontWeight: "bold",
  },
}
return(

<div style={styles.container}>   
    <img style={styles.BackIcon} src={BackIcon} alt="back" onClick={()=>navigate(to)}></img> 
    <div style={styles.title} >
        {label}
    </div>
</div>
)
}
export default Header