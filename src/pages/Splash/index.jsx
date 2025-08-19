import React from 'react';
import CustomButton from '../../components/CustomButton';
import JangboLogo from '../../assets/jangbo.svg';
import styles from '../Splash/Splash.module.css'
import {typo} from '../../styles/typography';
import {color} from '../../styles/color';
import {useNavigate} from "react-router-dom";
function Splash () {
    const navigate = useNavigate();
    return (
<div className={styles.container}>
<div className={styles.caption} style={typo.caption1}>우리동네 식자재 찾기부터 픽업까지</div>
<div className={styles.title} style={{...typo.largeTitleEmphasized, color: color.Green[50]}}>장보는  <span style={{ color: color.Grey[80] }}>친구</span></div>
<div className={styles.logoBg} style={{color: color.Green[5]}}>
<img className={styles.logo} src={JangboLogo} alt="logo"width={142} height={159}></img>
</div>
<div className={styles.button}>
<CustomButton label="로그인" to="/login" ></CustomButton>
</div>

{/*signup section */}
<div className={styles.signupSection}>
    <div style={{...typo.caption1, color: color.Grey[50]}}>회원이 아니신가요?</div>
    <div style={{...typo.caption1Emphasized, color: color.Grey[80]}} onClick={()=>navigate("/signup")}>회원가입 하기</div>    
</div>

</div>

    );
}

export default Splash;