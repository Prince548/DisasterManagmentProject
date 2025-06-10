import axios from "axios";

const apiReq = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

export default apiReq;
