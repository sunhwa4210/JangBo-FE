import React from "react";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import {typo} from '../../styles/typography';
import {color} from '../../styles/color';
import styles from '../Signup/SignupSelectRole.module.css'
import Button from './components/button'
function Signup (){
    return(
        <div>
            <Header label="회원가입" to="/splash"></Header>
            <div className={styles.container}>
            <div className={styles.label} style={typo.footnoteEmphasized}>
                회원가입 유형을 선택해주세요
            </div>
            <div className={styles.buttonSelect}>
            <Button label="고객"></Button>
            <Button label="상인"></Button>
            </div>
            <CustomButton label="다음" className={styles.next} to="/signup/:role"></CustomButton>
            </div>
        </div>
    )
}

export default Signup