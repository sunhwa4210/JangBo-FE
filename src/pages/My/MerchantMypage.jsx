import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import MerchantMenuBar from "../../components/MerchantMenuBar";
import { getMeMerchant, logoutMerchant } from "../../api/auth";

export default function MerchantMy() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchMe = useCallback(async (retries = 1) => {
    setErr("");
    setLoading(true);
    let lastErr;
    for (let i = 0; i <= retries; i++) {
      try {
        const data = await getMeMerchant(); 
        setMe(data);
        setLoading(false);
        return;
      } catch (e) {
        lastErr = e;
        if (i < retries) await new Promise((r) => setTimeout(r, 150));
      }
    }
    setErr(lastErr?.serverMsg || lastErr?.message || "내 정보 조회 실패");
    setLoading(false);
  }, []);

  useEffect(() => { fetchMe(1); }, [fetchMe]);

  useEffect(() => {
    const onFocus = () => fetchMe(0);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchMe]);

  const handleReload = () => fetchMe(0);

  const handleLogout = async () => {
    try {
      await logoutMerchant();
      navigate("/login", { replace: true });
    } catch {
      alert("로그아웃 실패");
    }
  };

  // 이름 표시: 서버가 주는 필드가 다를 수 있어 방어적으로
  const displayName =
    me?.name ||
    me?.username ||
    (me?.email ? me.email.split("@")[0] : "") ||
    "";

  // 공통 스타일
  const divider = { borderTop: "1px solid #EFEFEF" };
  const rowBase = {
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    background: "#fff",
    cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 56 }}>
      <Header label="마이페이지" to="/main" />

      <div style={{ ...divider, background: "#fff" }}>
        <div style={{ padding: "20px 16px" }}>
          {loading ? (
            <div aria-busy="true" style={{ lineHeight: 1.6 }}>
              <div style={{ width: 120, height: 14, background: "#eee", borderRadius: 4, marginBottom: 8 }} />
              <div style={{ width: 180, height: 18, background: "#eee", borderRadius: 4 }} />
            </div>
          ) : err ? (
            <div>
              <div style={{ color: "#d33", marginBottom: 8 }}>{err}</div>
              <button
                onClick={handleReload}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  borderRadius: 6,
                  fontSize: 14,
                }}
              >
                다시 불러오기
              </button>
            </div>
          ) : me?.authenticated ? (
            <>
              <div style={{ fontSize: 18, color: "#111", marginBottom: 6 }}>안녕하세요!</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>
                {displayName || "회원"} 님
              </div>
            </>
          ) : (
            <div>
              <div style={{ fontSize: 16, color: "#111", marginBottom: 8 }}>로그인이 필요합니다.</div>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  borderRadius: 6,
                  fontSize: 14,
                }}
              >
                로그인 화면으로
              </button>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>

        </div>
      </div>

      {/* 메뉴 리스트 */}
      <div style={{ marginTop: 12, ...divider }}>
        <MenuRow
          label="나의 정보 변경"
          onClick={() => navigate("/my/edit")}
        />
        <MenuRow label="로그아웃" onClick={handleLogout} />
        <MenuRow
          label="회원탈퇴"
          onClick={() => navigate("/my/withdrawal")} // 탈퇴 플로우 라우트로 연결
        />
      </div>

      <MerchantMenuBar />
    </div>
  );

  function MenuRow({ label, onClick }) {
    return (
      <div style={{ ...rowBase, ...divider }} onClick={onClick} role="button" tabIndex={0}
           onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}>
        <span style={{ fontSize: 16, color: "#111" }}>{label}</span>
        <span aria-hidden style={{ fontSize: 20, color: "#999" }}>›</span>
      </div>
    );
  }
}
