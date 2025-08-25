import axios from "axios";

const api = axios.create({
  baseURL: "/api",          // dev 프록시/배포 리버스 프록시 가정
  withCredentials: true,    // 세션 쿠키 전송
  timeout: 8000,
});

// ========== Products / Store ==========
export const getProducts = (merchantId, sort = "recent") =>
  api.get(`/products/merchants/${merchantId}`, { params: { sort } })
     .then(r => r.data);

export const getStore = (storeId) =>
  api.get(`/stores/${storeId}`)
     .then(r => r.data.store ?? r.data);

// ========== Cart ==========
export const addCartItem = (productId, quantity = 1) =>
  api.post(`/carts/items`, { productId, quantity })
     .then(r => r.data);

// 장바구니 전체 조회
export const fetchCart = () =>
  api.get(`/carts`).then(r => r.data); // { items, selectedItemCount, ... }

export const fetchCartSummary = (selectedItemIds) =>
  api.post(`/carts/selection/summary`, { selectedItemIds })
     .then(r => r.data);

export const setCartItemQuantity = (itemId, quantity) =>
  api.post(`/carts/items/${itemId}`, { itemId, quantity })
     .then(r => r.data);

export const increaseCartItem = (itemId) =>
  api.patch(`/carts/items/${itemId}/increase`)
     .then(r => r.data);

export const decreaseCartItem = (itemId) =>
  api.patch(`/carts/items/${itemId}/decrease`)
     .then(r => r.data);

export const deleteCartItem = (itemId) =>
  api.delete(`/carts/items/${itemId}`)
     .then(r => r.data);

export const deleteSelectedCartItems = (itemIds) =>
  api.delete(`/carts/items`, { data: { itemIds } })
     .then(r => r.data);

export const clearCart = () =>
  api.delete(`/carts`).then(r => r.data);

export default api;
