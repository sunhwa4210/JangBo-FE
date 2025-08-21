import React from "react";
import {color} from "../styles/color";
import SearchBtn from "../assets/searchBtn.svg";
function SearchField ({label}) {
    const styles={
        container:{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",

        },
        searchInput:{
            width: "247px",
            height: "22px",
            borderRadius: "30px",
            backgroundColor: color.Green[5],
            border: "none",
            padding: "14px 18px ",
        },
        button:{
            backgroundColor: color.Green[50],
            width: "42px",
            height: "42px",
            border: "none",
            borderRadius: "21px",
        }
    }
    return(
        <div style={styles.container}>
            <input style={styles.searchInput} placeholder={label}/>
            <button style={styles.button}><img src={SearchBtn} alt="검색"></img></button>
        </div>
    )
}

export default SearchField;