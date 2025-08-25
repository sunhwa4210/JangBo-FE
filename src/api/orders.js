
import api from "./api";

const extractOrderId = (res) => {
  if (!res) return null;
  if (Array.isArray(res)) return extractOrderId(res[0]); // 배열도 대응
  return res.orderId ?? res.id ?? res.order?.id ?? res.order?.orderId ?? null;
};

export const createOrder = (itemIds) =>
  api.post("/orders", { itemIds })        // ← 서버가 보통 기대하는 키는 itemIds
    .then(r => {
      const orderId = extractOrderId(r.data);
      if (!orderId) throw new Error("ORDER_ID_NOT_FOUND");
      return { orderId };                 // ← 프론트는 항상 { orderId }만 받음
    });
