import React from "react";
import ManuBar from "../../components/MenuBar"
import SearchField from "../../components/SearchField";
import LogoHeader from "../../components/LogoHeader";
import styles from "./Main.module.css";
import Pin from "../../assets/pin.svg";
import {typo} from "../../styles/typography";
import SortButton from "../../components/SortButton";
import AdsBanner from "../../components/AdsBanner";
import StoreList from "../../components/StoreList";
function Main (){
return(
<div>
<div className={styles.header}><LogoHeader></LogoHeader></div>
<div className={styles.search}><SearchField labe="검색어를 입력하세요"/></div>
<div className={styles.subheader}>
<div className={styles.location}>
<div><img src={Pin} alt="핀" className={styles.icon} width="20" height="20" /></div>
<div style={typo.caption1Emphasized}>공릉도깨비시장</div>
</div>
<div className={styles.sort}>
<SortButton label="최신순"/>
<SortButton label="인기순"/>
</div>
</div>
<AdsBanner/>
<StoreList/>
<StoreList/>
<StoreList/>
<StoreList/>
<StoreList/>
<ManuBar/>
</div>
) 

}

export default Main

