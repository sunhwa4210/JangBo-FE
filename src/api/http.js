// src/api/http.js
import axios from "axios";

const http = axios.create({
  baseURL: "https://3.36.56.52:8080",            // proxy 적용 시 localhost:3000 기준
  withCredentials: true,   // 모든 요청에 쿠키 포함
  timeout: 10000,
});

export default http;