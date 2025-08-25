import { useState, useRef, useEffect } from "react";
import styles from "./StoreIntro.module.css";
import http from "../../../api/http";

export default function StoreIntro({
  storeName,
  category,
  intro,
  onChangeIntro,
}) {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [mode, setMode] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  // mode가 manual로 바뀌면 input에 포커스
  useEffect(() => {
    if (mode === "manual") {
      inputRef.current?.focus();
    }
  }, [mode]);

  // AI 추천 받기 버튼 클릭
  const handleAiSuggest = async () => {
    console.log("보낼 값:", { storeName, category });

    setMode("ai"); // 후보 모드 켜기
    setLoading(true);
    try {
      const res = await http.post("/api/stores/tagline/suggest", {
        storeName,
        category,
      });

      if (res.data.success) {
        setCandidates(res.data.candidates);
        setSelectedIndex(null);
        setErrorMessage(""); // 성공 시 에러메시지 초기화
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          "AI 추천 기능을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
        );
      } else {
        setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 후보 클릭
  const handleSelect = (text, idx) => {
    if (selectedIndex === idx) {
      onChangeIntro(""); // 해제
      setSelectedIndex(null);
    } else {
      onChangeIntro(text);
      setSelectedIndex(idx);
    }
  };

  return (
    <div className={styles.intro}>
      <div className={styles.inputItemBox}>
        <div className={styles.inputItem}>
          <label>한줄 소개글</label>
          <div className={styles.buttonWrapper}>
            <button
              type="button"
              className={`${styles.writebutton} ${
                mode === "manual" ? styles.active : ""
              }`}
              onClick={() => {
                setMode("manual");
                setCandidates([]);
                setSelectedIndex(null);
              }}
            >
              직접 입력
            </button>
            <button
              type="button"
              className={`${styles.aibutton} ${
                mode === "ai" ? styles.active : ""
              }`}
              onClick={handleAiSuggest}
              disabled={loading}
            >
              {loading ? "AI 생성중..." : "AI 추천 받기"}
            </button>
          </div>
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>

      {/* 입력칸: 항상 보이도록 */}
      <div className={styles.inputBox}>
        <input
          type="text"
          placeholder="입력해주세요"
          value={intro}
          onChange={(e) => {
            onChangeIntro(e.target.value);
            setSelectedIndex(null);
          }}
          style={{
            display: "block",
            marginTop: "10px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* 후보 버튼: aiMode일 때만 보이도록 */}
      {mode === "ai" && candidates.length > 0 && (
        <div className={styles.candidateWrapper}>
          {candidates.map((c, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.candidateButton} ${
                selectedIndex === idx ? styles.selected : ""
              }`}
              onClick={() => handleSelect(c, idx)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
