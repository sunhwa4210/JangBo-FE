import {color} from "../../../styles/color";
import React, { useState } from "react";

function Button({label}) {
const [clicked,setClicked] =useState(false);
return(
    <button
    onClick={() => setClicked(!clicked)}
    style={{
        backgroundColor: clicked? color.Green[5]:color.Grey.white,
        border: clicked?`1px solid ${color.Green[50]}`:`1px solid ${color.Grey[40]}`,
        borderRadius: "30px",
        paddingVertical: "14px",
        paddingHorizental: "32px",
        fontSize:"17px",
        fontWeight: "600",
        width: "180px",
        height: "60px",
        color: clicked?color.Green[50]:"hsla(0, 0%, 0%, 1)",
    }}>
    {label}
    </button>
)
}

export default Button 