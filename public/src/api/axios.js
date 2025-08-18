import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
});

// Interceptor to auto-logout if backend says 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login"; // redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
