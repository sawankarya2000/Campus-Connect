import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:3000/api/v1/",

  withCredentials: true,
});

if (localStorage.getItem("token"))
  api.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
    "token"
  )}`;

export default api;
