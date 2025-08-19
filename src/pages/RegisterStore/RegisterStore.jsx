import styles from "./RegisterStore.module.css";
import Header from "../../components/Header.jsx";
import CustomButton from "../../components/CustomButton.jsx";
import { useState } from "react";
import axios from "axios";

export default function RegisterStore() {
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [openHour, setOpenHour] = useState("");
  const [openMin, setOpenMin] = useState("");
  const [closeHour, setCloseHour] = useState("");
  const [closeMin, setCloseMin] = useState("");
  const [dayOff, setDayOff] = useState([]);
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [intro, setIntro] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // 모든 값이 다 채워졌는지 검사
  const isFormValid =
    storeName.trim() &&
    storeAddress.trim() &&
    openHour.trim() &&
    openMin.trim() &&
    closeHour.trim() &&
    closeMin.trim() &&
    dayOff.trim() &&
    phone.trim() &&
    category.trim() &&
    intro.trim() &&
    imageFile.trim();

  // 요일 버튼 클릭
  const toggleDayOff = (day) => {
    setDayOff((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // 카테고리 버튼 클릭
  const handleCategory = (cat) => setCategory(cat);

  // 이미지 업로드
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("storeName", storeName);
    formData.append("storeAddress", storeAddress);
    formData.append("openTime", `${openHour}:${openMin}`); //시,분 합쳐서 append
    formData.append("closeTime", `${closeHour}:${closeMin}`);
    dayOff.forEach((d) => formData.append("dayOff", d));
    formData.append("storePhoneNumber", phone);
    formData.append("category", category);
    formData.append("intro", intro);
    if (imageFile) formData.append("storeImage", imageFile);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/stores`,
        formData,
        { withCredentials: true } // 세션 쿠키 포함
      );
      console.log("상점 등록 성공:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header label="상점 관리" to="" />

      <form onSubmit={handleSubmit}>
        {/* 상점 이미지 업로드 */}
        <div className={styles.imageSection}>
          <div className={styles.image}></div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="storeImage"
            style={{ display: "none" }}
          />
          <label htmlFor="storeImage" className={styles.imageButton}>
            이미지 변경하기
          </label>
        </div>

        <div className={styles.form}>
          {/* 상점명 입력칸 */}
          <div className={styles.inputItem}>
            <label>상점명</label>
            <input
              type="text"
              placeholder="입력해주세요"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
          {/* 주소 입력칸 */}
          <div className={styles.inputItem}>
            <label>주소</label>
            <input
              type="text"
              placeholder="입력해주세요"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
            />
          </div>
          {/* 운영시간 입력칸 */}
          <div className={styles.inputItem}>
            <label>운영시간</label>
            <div className={styles.timeContainer}>
              <div className={styles.timeselect}>
                <input
                  type="text"
                  placeholder="00"
                  className={styles.timeInput}
                  value={openHour}
                  onChange={(e) => setOpenHour(e.target.value)}
                />
                :
                <input
                  type="text"
                  placeholder="00"
                  className={styles.timeInput}
                  value={openMin}
                  onChange={(e) => setOpenMin(e.target.value)}
                />
                <span>에 열어요</span>
              </div>
              <div className={styles.timeselect}>
                <input
                  type="text"
                  placeholder="00"
                  className={styles.timeInput}
                  value={closeHour}
                  onChange={(e) => setCloseHour(e.target.value)}
                />
                :
                <input
                  type="text"
                  placeholder="00"
                  className={styles.timeInput}
                  value={closeMin}
                  onChange={(e) => setCloseMin(e.target.value)}
                />
                <span>에 닫아요</span>
              </div>
            </div>
          </div>

          {/* 정기휴무일 입력칸*/}
          <div>
            <div className={styles.inputItem}>
              <label>정기 휴무일</label>
              <input
                id="dayoff"
                type="text"
                placeholder="입력해주세요"
                value={dayOff}
              />
            </div>
            <div className={styles.buttonContainer}>
              {["월", "화", "수", "목", "금", "토", "일", "연중무휴"].map(
                (day) => (
                  <button
                    type="button"
                    key={day}
                    className={`${styles.button} ${
                      dayOff.includes(day) ? styles.active : ""
                    }`}
                    onClick={() => toggleDayOff(day)}
                  >
                    {day}
                  </button>
                )
              )}
            </div>
          </div>
          {/* 전화번호 입력칸 */}
          <div className={styles.inputItem}>
            <label>전화번호</label>
            <input
              type="text"
              placeholder="입력해주세요"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          {/* 카테고리 입력칸 */}
          <div>
            <div className={styles.inputItem}>
              <label>카테고리</label>
              <input
                type="text"
                placeholder="입력해주세요"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className={styles.buttonContainer}>
              {[
                "수산",
                "야채",
                "과일",
                "잡곡/견과",
                "장/조미료",
                "정육/계란",
                "반찬",
                "건어물",
                "생활잡화",
              ].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`${styles.button} ${
                    category === cat ? styles.active : ""
                  }`}
                  onClick={() => handleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputItem}>
            <label>한줄 소개글</label>
            <div className={styles.buttonWrapper}>
              <button className={styles.writebutton}>직접 입력</button>
              <button className={styles.aibutton}>AI 추천 받기</button>
            </div>
          </div>
          <input
            type="text"
            placeholder="입력해주세요"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            style={{
              display: "block",
              marginLeft: "30px",
              marginRight: "auto",
            }}
          />
          <img />
        </div>
      </form>

      {/* 페이지 이동 경로 확인 */}
      <CustomButton
        label="완료"
        className={styles.donebutton}
        to="/signup/:role/success"
        disabled={!isFormValid}
      ></CustomButton>
    </div>
  );
}
