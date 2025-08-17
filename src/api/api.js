import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,   
});

// 상품 API
export const getProducts = async (storeId, sort) => {
  const res = await api.get(`/products/merchants/${storeId}`, {
    params: { sort },
  });
  return res.data;
};

// 상점 API
export const getStore = async (storeId) => {
  const res = await api.get(`/stores/${storeId}`);
  return res.data.store;
};


export default api;