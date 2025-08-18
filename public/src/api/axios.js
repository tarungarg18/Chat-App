import axios from "axios";
import { host } from "../utils/APIRoutes";

const api = axios.create({
  baseURL: `${host}/api`,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
