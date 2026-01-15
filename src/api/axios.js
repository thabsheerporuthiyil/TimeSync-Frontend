import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* 
  REQUEST INTERCEPTOR
  Attach access token 
*/

api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


/* 
   RESPONSE INTERCEPTOR
   Refresh token logic
 */

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // DO NOT intercept login errors
    if (originalRequest.url.includes("login")) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("refresh")
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        forceLogout();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${BASE_URL}accounts/refresh/`,
          { refresh }
        );

        localStorage.setItem("access", res.data.access);

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        forceLogout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


/* 
   FORCE LOGOUT
*/
function forceLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.replace("/login");
}

export default api;
