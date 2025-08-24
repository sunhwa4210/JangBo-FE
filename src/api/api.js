import axios from "axios";
import http from "./http";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 5000,
  withCredentials: true, 
});

// 상품 API
export const getProducts = async (merchantId, sort) => {
  console.log("getProducts 호출:", merchantId, sort);
  const res = await api.get(`/api/products/merchants/${merchantId}`, {
    params: { sort },
  });
  return res.data;
};

// 상점 API
export const getStore = async (storeId) => {
  const res = await api.get(`/api/stores/${storeId}`);
  return res.data.store;
};

//장바구니 API
export const addCartItem = async (productId, quantity) => {
  const res = await http.post(`/api/carts/items`, {
    productId,
    quantity,
  });
  return res.data;
};

export default api;
