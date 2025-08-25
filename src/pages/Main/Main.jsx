import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManuBar from "../../components/MenuBar";
import SearchField from "../../components/SearchField";
import LogoHeader from "../../components/LogoHeader";
import styles from "./Main.module.css";
import Pin from "../../assets/pin.svg";
import { typo } from "../../styles/typography";
import SortButton from "../../components/SortButton";
import AdsBanner from "../../components/AdsBanner";
import StoreList from "../../components/StoreList";
import { fetchStores } from "../../api/stores";

function Main() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [sort, setSort] = useState("");       // "" | "recent"
  const [keyword, setKeyword] = useState(""); // 입력 중
  const [q, setQ] = useState("");             // 실제 검색 적용 값

  // sort 변경 시 API 호출
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await fetchStores({ sort });
        if (!alive) return;
        setStores(data);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "목록을 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [sort]);

  // 클라 검색 필터
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return stores;
    return stores.filter((s) => {
      const fields = [
        s?.storeName,
        s?.category,
        s?.storeAddress,
        s?.storePhoneNumber,
      ].map((v) => (v || "").toString().toLowerCase());
      return fields.some((f) => f.includes(query));
    });
  }, [stores, q]);

  const handleSortRecent = () => setSort("recent");
  const handleSortPopular = () => {
    // 임시: 이름 가나다 정렬 (서버 인기순 나오면 API로 교체)
    const sorted = [...stores].sort((a, b) =>
      (a.storeName || "").localeCompare(b.storeName || "", "ko")
    );
    setStores(sorted);
    setSort(""); // 커스텀 정렬 상태 표시용
  };

  const handleSearchSubmit = () => setQ(keyword);

  // ✅ 리스트 아이템 클릭 시 라우팅 (안전 가드 포함)
  const handleStoreItemClick = (store, idFromList) => {
    const id =
      idFromList ??
      store?.storeId ??
      store?.id ??
      store?.store_id ??
      null;

    if (!id) {
      console.warn("상점 ID가 없어 상세 페이지로 이동하지 않습니다:", store);
      return;
    }
    navigate(`/stores/${id}`);
  };

  return (
    <div>
      <div className={styles.header}><LogoHeader /></div>

      <div className={styles.search}>
        <SearchField
          label="검색어를 입력하세요"
          value={keyword}
          onChange={setKeyword}
          onSubmit={handleSearchSubmit}
        />
      </div>

      <div className={styles.subheader}>
        <div className={styles.location}>
          <div><img src={Pin} alt="핀" className={styles.icon} width="20" height="20" /></div>
          <div style={typo.caption1Emphasized}>공릉도깨비시장</div>
        </div>
        <div className={styles.sort}>
          <SortButton label="최신순" onClick={handleSortRecent} active={sort === "recent"} />
          <SortButton label="인기순" onClick={handleSortPopular} active={sort === "" && q === ""} />
        </div>
      </div>

      <AdsBanner />

      <div style={{ padding: "8px 12px", fontSize: 12, opacity: 0.7 }}>
        {q ? `‘${q}’ 검색 결과: ${filtered.length}개` : `전체 상점: ${filtered.length}개`}
      </div>

      <StoreList
        stores={filtered}
        loading={loading}
        error={err}
        onItemClick={handleStoreItemClick}  // ← 여기서 명확히 라우팅 제어
      />

      <ManuBar />
    </div>
  );
}

export default Main;
