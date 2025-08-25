// src/play/OrderStatusSheetPlayground.jsx
import { useState } from "react";
import BottomSheet from "../components/BottomSheet.jsx";

// 탭 UI 간단본 (실제 StepTabs 쓰고 있으면 그걸 import 하세요)
const steps = [
  { key: "PAYMENT_REQUESTED", label: "결제요청" },
  { key: "ORDER_CHECKING",    label: "주문 확인" },
  { key: "ORDER_ACCEPTED",    label: "주문 수락" },
  { key: "READY_FOR_PICKUP",  label: "준비 완료" },
];

function MiniSteps({ current }) {
  const idx = Math.max(0, steps.findIndex(s => s.key === current));
  return (
    <div style={{padding: "8px 16px 0"}}>
      <div style={{position:"relative",height:4,background:"#eee",borderRadius:999}}>
        <div style={{
          position:"absolute",inset:0,width:`${(idx/(steps.length-1))*100}%`,
          background:"#1ea365",borderRadius:999,transition:"width .3s"
        }}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
        {steps.map((s,i)=>(
          <div key={s.key} style={{fontSize:12,color:i<=idx?"#1ea365":"#aaa",fontWeight:i<=idx?700:400}}>
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const messages = {
  PAYMENT_REQUESTED: {
    title: "주문을 확인하고 있습니다",
    desc: "주문 수락 즉시 상품 준비가 시작됩니다.\n상품 준비 완료 후, 1시간 이내에 픽업해 주세요!",
    cta: "주문 취소",
  },
  ORDER_CHECKING: {
    title: "상품을 준비하고 있습니다",
    desc: "주문을 수락하여 상품을 신속히 준비하고 있습니다.\n준비 완료 후, 1시간 이내에 픽업해 주세요!",
    cta: "문의하기",
  },
  ORDER_ACCEPTED: {
    title: "상품을 준비하고 있습니다",
    desc: "픽업 준비가 끝나면 알려드릴게요.\n1시간 내 픽업해 주세요!",
    cta: "문의하기",
  },
  READY_FOR_PICKUP: {
    title: "지금 픽업대에서 픽업해주세요!",
    desc: "1시간 이내에 찾아가지 않으면 품질 문제로 폐기될 수 있어요.",
    cta: "픽업 QR",
  },
};

const mockItems = [
  { id: 1, name: "샐러 전장용 500ml", option: "당근만 강화", qty: 1, price: 3500 },
  { id: 2, name: "샐러 전장용 500ml", option: "양파만 강화", qty: 1, price: 3500 },
  { id: 3, name: "샐러 전장용 500ml", option: "정답은 경비", qty: 1, price: 3500 },
];

export default function OrderStatusSheetPlayground() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("PAYMENT_REQUESTED");

  const view = messages[state];
  const total = mockItems.reduce((s,x)=>s + x.price * x.qty, 0);

  return (
    <div style={{padding:20}}>
      <h1>OrderStatusSheet Playground</h1>

      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {steps.map(s=>(
          <button
            key={s.key}
            onClick={() => setState(s.key)}
            style={{
              padding:"8px 12px", borderRadius:999, border:"1px solid #ddd",
              background: s.key===state ? "#1ea365" : "#fff",
              color: s.key===state ? "#fff" : "#222",
              fontWeight:600
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{marginTop:16, display:"flex", gap:8}}>
        <button
          onClick={() => setOpen(true)}
          style={{padding:"10px 14px",borderRadius:8,border:"1px solid #ddd",background:"#fff"}}
        >
          바텀시트 열기
        </button>
        <button
          onClick={() => setOpen(false)}
          style={{padding:"10px 14px",borderRadius:8,border:"1px solid #ddd",background:"#fff"}}
        >
          바텀시트 닫기
        </button>
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="공릉 도깨비시장점">
        <MiniSteps current={state} />

        <h2 style={{fontSize:20,fontWeight:700,margin:"16px 16px 8px"}}>{view.title}</h2>
        <p style={{fontSize:13,color:"#444",whiteSpace:"pre-wrap",margin:"0 16px 12px"}}>
          {view.desc}
        </p>

        <div style={{margin:"8px 16px",border:"1px solid #eee",borderRadius:12,overflow:"hidden"}}>
          <button style={{width:"100%",textAlign:"left",padding:"12px 16px",background:"#fafafa",border:0,borderBottom:"1px solid #eee"}}>
            타이틀 <span style={{float:"right"}}>▾</span>
          </button>

          <div style={{padding:"0 16px"}}>
            {mockItems.map(it=>(
              <div key={it.id} style={{display:"grid",gridTemplateColumns:"48px 1fr auto auto",gap:12,alignItems:"center",padding:"10px 0"}}>
                <div style={{width:48,height:48,background:"#eee",borderRadius:8}} />
                <div style={{minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden"}}>{it.name}</div>
                  <div style={{fontSize:12,color:"#666"}}>{it.option}</div>
                </div>
                <div style={{fontSize:12,color:"#555"}}>{it.qty}개</div>
                <div style={{fontWeight:600}}>{it.price.toLocaleString()}원</div>
              </div>
            ))}
          </div>

          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",borderTop:"1px dashed #eee",fontWeight:700}}>
            <span>총 결제 금액</span>
            <strong>{total.toLocaleString()}원</strong>
          </div>
        </div>

        <div style={{position:"sticky",bottom:0,background:"#fff",padding:"12px 16px",display:"flex",gap:8}}>
          <button style={{flex:1,height:48,borderRadius:12,background:"#1ea365",color:"#fff",border:0,fontWeight:700}}>
            {view.cta}
          </button>
          {state!=="READY_FOR_PICKUP" && (
            <button style={{flex:1,height:48,borderRadius:12,background:"#f2f2f2",border:0}}>
              닫기
            </button>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}
