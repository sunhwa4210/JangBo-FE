import React, { useState, useRef } from "react";
import ManuBar from "../../components/MenuBar";
import LogoHeader from "../../components/LogoHeader";
import SearchField from "../../components/SearchField";
import Jangbo from "../../assets/jangbo.svg";
import { typo } from "../../styles/typography";
import { color } from "../../styles/color";
import styles from "./AiJangbo.module.css";
import { analyzeQuestion, getRecommendations, bulkAddToCart } from "../../api/ai";
import Minus from "../../assets/minus.svg";
import Plus from "../../assets/plus.svg";
import Cart from "../../assets/cart.svg";
import CartFocus from "../../assets/cart_focus.svg";
import { useNavigate, useLocation } from "react-router-dom";

const FILTERS = {
  CHEAPEST: "CHEAPEST",
  LONGEST_EXPIRY: "LONGEST_EXPIRY",
  MAX_ONE: "MAX_COVERAGE_ONE_STORE",
};

const loadingTextByFilter = {
  [FILTERS.CHEAPEST]: "식재료의 가격이 가장 저렴한 상점들로 찾는 중…",
  [FILTERS.LONGEST_EXPIRY]: "유통기한이 넉넉한 상품 위주로 찾는 중…",
  [FILTERS.MAX_ONE]: "가능한 한 곳에서 모두 살 수 있도록 찾는 중…",
};

const CTA = { ALL: "ALL", MORE: "MORE" };
const ctaLabel = {
  [CTA.ALL]: "모두 장바구니에 담을래요",
  [CTA.MORE]: "다른 식재료들도 볼래요",
};
const ctaLoadingText = {
  [CTA.ALL]: "추천 목록을 모두 장바구니에 담는 중…",
  [CTA.MORE]: "다른 식재료 추천으로 이동 중…",
};

function AiJangbo() {
  const navigate = useNavigate();
  const location = useLocation();

  const [phase, setPhase] = useState("idle"); // idle | loadingAnalyze | awaitFilter | loadingRecommend | done | error
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [filter, setFilter] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const [navigating, setNavigating] = useState("");   // "main" | "cart" | "restart" | ""
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const reqTokenRef = useRef(0);

  // 수량/일괄담기 상태
  const [qtyMap, setQtyMap] = useState({});
  const [bulkDone, setBulkDone] = useState(false);

  // 각 상품의 '담김' 상태
  const [addedMap, setAddedMap] = useState({});
  const [ctaSelected, setCtaSelected] = useState(null); // 'ALL' | 'MORE' | null

  // 1차: 질문 분석
  const ask = async () => {
    const q = input.trim();
    if (!q || busy) return;

    setBusy(true);
    const myToken = reqTokenRef.current + 1;
    reqTokenRef.current = myToken;

    setErr("");
    setQuestion(q);
    setInput("");
    setAnswer("");
    setIngredients([]);
    setResult(null);
    setBulkDone(false);
    setQtyMap({});
    setAddedMap({});
    setCtaSelected(null);

    try {
      setPhase("loadingAnalyze");
      const a = await analyzeQuestion(q);
      if (reqTokenRef.current !== myToken) return;

      const ings = (a?.ingredients || []).map((s) => s.trim()).filter(Boolean);
      setAnswer(a?.answer || "");
      setIngredients(ings);
      setPhase("awaitFilter");
    } catch (e) {
      console.error("[analyzeQuestion] error:", e);
      setErr(e?.serverMsg || e?.message || "요청 실패");
      setPhase("error");
    } finally {
      setBusy(false);
    }
  };

  // 2차: 필터 선택 시 추천 호출
  const refetchWithFilter = async (nextFilter) => {
    setFilter(nextFilter);
    if (!ingredients.length || busy) return;

    setBusy(true);
    const myToken = reqTokenRef.current + 1;
    reqTokenRef.current = myToken;

    try {
      setPhase("loadingRecommend");
      const rec = await getRecommendations({ ingredients, filter: nextFilter });
      if (reqTokenRef.current !== myToken) return;
      setResult(rec);
      setAddedMap({});
      setCtaSelected(null);
      setPhase("done");
    } catch (e) {
      console.error("[getRecommendations] error:", e);
      setErr(e?.serverMsg || e?.message || "추천 실패");
      setPhase("error");
    } finally {
      setBusy(false);
    }
  };

  // 수량 증감
  const inc = (id) => setQtyMap((m) => ({ ...m, [id]: (m[id] || 1) + 1 }));
  const dec = (id) => setQtyMap((m) => ({ ...m, [id]: Math.max(1, (m[id] || 1) - 1) }));

  // 개별 담기
  const addOne = async (productId) => {
    if (busy) return;
    setAddedMap((m) => ({ ...m, [productId]: true })); // 낙관적 UI
    try {
      setBusy(true);
      await bulkAddToCart([{ productId, quantity: qtyMap[productId] || 1 }]);
    } catch (e) {
      console.error("[bulkAddToCart one] error:", e);
      if (e?.status === 401) {
        setAddedMap((m) => {
          const next = { ...m }; delete next[productId]; return next;
        });
        navigate("/login", { replace: true, state: { redirectTo: location.pathname } });
        return;
      }
      setAddedMap((m) => {
        const next = { ...m }; delete next[productId]; return next;
      });
      alert(e?.serverMsg || "담기에 실패했어요.");
    } finally {
      setBusy(false);
    }
  };

  // 전체 담기
  const addAllToCart = async () => {
    if (!result?.picks?.length || busy) return;
    const items = result.picks.map(({ product }) => ({
      productId: product.id,
      quantity: qtyMap[product.id] || 1,
    }));
    try {
      setBusy(true);
      await bulkAddToCart(items);
      setBulkDone(true);
      setAddedMap((m) => {
        const next = { ...m };
        result.picks.forEach(({ product }) => { next[product.id] = true; });
        return next;
      });
    } catch (e) {
      console.error("[bulkAddToCart all] error:", e);
      if (e?.status === 401) {
        navigate("/login", { replace: true, state: { redirectTo: location.pathname } });
        return;
      }
      alert(e?.serverMsg || "담기에 실패했어요.");
    } finally {
      setBusy(false);
    }
  };

  // CTA 클릭
  const onClickAddAll = async () => {
    if (busy) return;
    setCtaSelected(CTA.ALL);
    await addAllToCart();
  };
  const onClickSeeMore = () => {
    if (busy) return;
    setCtaSelected(CTA.MORE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 완료 패널 3버튼 핸들러
  const handleGoMain = () => {
    setNavigating("main");
    navigate("/main");
  };
  const handleGoCart = () => {
    setNavigating("cart");
    navigate("/cart");
  };
  const handleRestart = () => {
    setNavigating("restart");
    // 1차 자연어 단계로 리셋
    setPhase("idle");
    setQuestion("");
    setAnswer("");
    setIngredients([]);
    setFilter("");
    setResult(null);
    setErr("");
    setInput("");
    setQtyMap({});
    setAddedMap({});
    setCtaSelected(null);
    setBulkDone(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterLabel = {
    [FILTERS.CHEAPEST]: "가격이 가장 저렴한 식재료",
    [FILTERS.LONGEST_EXPIRY]: "유통기한이 가장 많이 남은 식재료",
    [FILTERS.MAX_ONE]: "최대한 상점 한 곳에서만 구매할 수 있는 식재료",
  };

  return (
    <div className={styles.container}>
      <div><LogoHeader /></div>

      <div className={styles.chatSection}>
        {(phase === "awaitFilter" || phase === "loadingRecommend" || phase === "done" || phase === "error") ? (
          <div className={styles.qSection}>
            <div className={styles.qTitle}>{question}</div>
          </div>
        ) : (
          <>
            <div style={typo.subheadlineEmphasized}>우리 동네 식자재 찾기</div>
            <div className={styles.subtitle} style={typo.headlineEmphasized}>
              <span style={{ color: color.Green[50] }}>AI 장보</span>가 도와드릴게요!
            </div>
          </>
        )}

        {phase === "idle" && (
          <div className={styles.icon}>
            <img src={Jangbo} alt="로고" width={115} height={115} />
          </div>
        )}

        {phase === "loadingAnalyze" && (
          <div className={styles.loading2}>
            <div className={styles.pulse} />
            <div className={styles.loadingText}>질문을 분석하고 있어요…</div>
          </div>
        )}

        {(phase === "awaitFilter" || phase === "loadingRecommend" || phase === "done" || phase === "error") && (
          <div className={styles.resultCard}>
            {err ? (
              <div className={styles.error}>{err}</div>
            ) : (
              <>
                <div className={styles.aiHeader}>
                  <img className={styles.ailogo} src={Jangbo} alt="" width={30} height={30} />
                  <span className={styles.aiText}>AI 장보의 답변</span>
                </div>

                {!!answer && (
                  <p className={styles.answer}>
                    {(() => {
                      const normalize = (s) => s.replace(/[^\p{L}\p{N}]+/gu, "").trim();
                      const ingSet = new Set(ingredients.map((x) => normalize(x)));
                      const tokens = answer.split(/(\s+|[,.!?:;~()[\]{}"“”'’…-]+)/);
                      let brInserted = false;
                      return tokens.map((token, i) => {
                        if (/^\s+$|^[,.!?:;~()[\]{}"“”'’…-]+$/.test(token)) return token;
                        const norm = normalize(token);
                        const isIngredient = norm && ingSet.has(norm);
                        if (isIngredient && !brInserted) {
                          brInserted = true;
                          return (
                            <React.Fragment key={i}>
                              <br />
                              <strong className={styles.answerBold}>{token}</strong>
                            </React.Fragment>
                          );
                        }
                        if (isIngredient) {
                          return <strong key={i} className={styles.answerBold}>{token}</strong>;
                        }
                        return token;
                      });
                    })()}
                  </p>
                )}

                <div className={styles.condQ}>어떤 조건에 맞게 식재료를 추천해 드릴까요?</div>
                <div className={styles.pills}>
                  <button
                    className={`${styles.pill} ${filter === FILTERS.CHEAPEST ? styles.pillActive : ""}`}
                    onClick={() => !busy && refetchWithFilter(FILTERS.CHEAPEST)}
                    disabled={busy}
                  >가격이 가장 저렴한 식재료</button>
                  <button
                    className={`${styles.pill} ${filter === FILTERS.LONGEST_EXPIRY ? styles.pillActive : ""}`}
                    onClick={() => !busy && refetchWithFilter(FILTERS.LONGEST_EXPIRY)}
                    disabled={busy}
                  >유통기한이 가장 많이 남은 식재료</button>
                  <button
                    className={`${styles.pill} ${filter === FILTERS.MAX_ONE ? styles.pillActive : ""}`}
                    onClick={() => !busy && refetchWithFilter(FILTERS.MAX_ONE)}
                    disabled={busy}
                  >최대한 상점 한 곳에서만 구매할 수 있는 식재료</button>
                </div>

                {(phase === "loadingRecommend" || phase === "done") && (
                  <div className={styles.selectedEchoRow}>
                    <div className={styles.selectedEchoPill}>{filterLabel[filter]}</div>
                  </div>
                )}
                {(phase === "loadingRecommend" || phase === "done") && (
                  <p className={styles.findingText}>{loadingTextByFilter[filter]}</p>
                )}

                {phase === "done" && (
                  <>
                    <div className={styles.sectionTitle}>추천 결과</div>
                    <p className={styles.recoDesc}>
                      {`공릉 도깨비시장에서 ${filterLabel[filter]}들로만 가져왔어요.`}
                    </p>
                    <p className={styles.recoDesc2}>AI 장보의 추천이 마음에 든다면, 식재료를 장바구니에 담아보세요 !</p>

                    <div className={styles.list}>
                      {result?.picks?.map(({ ingredient, product }) => (
                        <div key={`${ingredient}-${product.id}`} className={styles.item}>
                          <div className={styles.left}>
                            <div className={styles.thumb}>
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} />
                              ) : (
                                <div className={styles.noimg}></div>
                              )}
                            </div>
                            <div className={styles.meta}>
                              <div className={styles.name}>{product.name}</div>
                              <div className={styles.subStore}>{product.storeName}</div>
                              <div className={styles.subPrice}>
                                {product.price?.toLocaleString()}원
                              </div>
                            </div>
                          </div>

                          <div className={styles.rightRow}>
                            <div className={styles.stepper}>
                              <button onClick={() => !busy && dec(product.id)} disabled={busy}>
                                <img src={Minus} alt="-" width={12} height={12} />
                              </button>
                              <span>{qtyMap[product.id] || 1}</span>
                              <button onClick={() => !busy && inc(product.id)} disabled={busy}>
                                <img src={Plus} alt="+" width={12} height={12} />
                              </button>
                            </div>
                            <div>
                              <button
                                className={`${styles.addBtn} ${addedMap[product.id] ? styles.addBtnActive : ""}`}
                                onClick={() => addOne(product.id)}
                                disabled={busy}
                                aria-label="장바구니 담기"
                              >
                                <img
                                  src={addedMap[product.id] ? CartFocus : Cart}
                                  alt=""
                                  width={12}
                                  height={12}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.ctaRow}>
                      <div className={`${styles.pills} ${styles.ctaPills}`}>
                        <button
                          type="button"
                          className={`${styles.pill} ${ctaSelected === CTA.ALL ? styles.pillActive : ""}`}
                          onClick={onClickAddAll}
                          disabled={busy}
                        >
                          {ctaLabel[CTA.ALL]}
                        </button>

                        <button
                          type="button"
                          className={`${styles.pill} ${ctaSelected === CTA.MORE ? styles.pillActive : ""}`}
                          onClick={onClickSeeMore}
                          disabled={busy}
                        >
                          {ctaLabel[CTA.MORE]}
                        </button>
                      </div>
                    </div>

                    {/* CTA Echo & 진행문구 */}
                    {ctaSelected && (
                      <div className={styles.selectedEchoRow}>
                        <div className={styles.selectedEchoPill}>{ctaLabel[ctaSelected]}</div>
                      </div>
                    )}
                    {ctaSelected && (
                      <p className={styles.findingText}>{ctaLoadingText[ctaSelected]}</p>
                    )}



{bulkDone && (
  <div className={styles.doneWrap} role="dialog" aria-label="장바구니 담기 완료">
    <div className={styles.doneBox}>
      <div className={styles.doneTitle}>AI 장보의 추천 목록을 모두 장바구니에 담았어요!</div>

      <div className={styles.doneBtns}>
        <button
          className={styles.secondary}
          onClick={handleGoMain}
          disabled={!!navigating}
        >
          다른 식재료들도 볼래요
        </button>

        <button
          className={styles.primary}
          onClick={handleGoCart}
          disabled={!!navigating}
        >
          바로 결제하고 픽업 주문할래요
        </button>

        <button
          className={styles.secondary}
          onClick={handleRestart}
          disabled={!!navigating}
        >
          다른 식재료나 메뉴에 대한 추천을 받아볼래요
        </button>
      </div>

      {navigating === "cart" && (
        <p className={styles.movingText} aria-live="polite">
          결제 화면으로 이동 중…
        </p>
      )}
    </div>
  </div>
)}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.search}>
        <SearchField
          label="필요한 식재료나 메뉴를 물어보세요"
          value={input}
          onChange={setInput}
          onSubmit={ask}
          disabled={busy}
        />
      </div>

      <ManuBar />
    </div>
  );
}

export default AiJangbo;
