import React from "react";
import ManuBar from "../../components/MenuBar";
import LogoHeader from "../../components/LogoHeader";
import SearchField from "../../components/SearchField";
import Jangbo from "../../assets/jangbo.svg";
import {typo} from "../../styles/typography";
import {color} from "../../styles/color";
import styles from "./AiJangbo.module.css";

function AiJangbo() {
  return (
    <div className={styles.container}>
      <div><LogoHeader /></div>
      <div className={styles.chatSection}>
        <div style={typo.subheadlineEmphasized}>우리 동네 식자재 찾기</div>
        <div className={styles.subtitle}style={typo.headlineEmphasized}><span style={{ color: color.Green[50] }}>AI 장보</span>가 도와드릴게요! </div>
        <div className={styles.icon}> <img src={Jangbo} alt="로고" width={115} height={115} /></div>
      </div>
      <div className={styles.search}>
        <SearchField label="필요한 식자재나 메뉴를 물어보세요" />
      </div>
      <ManuBar />
    </div>
  );
}

export default AiJangbo;
