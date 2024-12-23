import axios from "axios";
import { baseUrl } from "./app";
import Auth from "utils/Auth";

axios.defaults.headers["Accept"] = "application/json";
axios.defaults.headers["Content-type"] = "application/json";
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  // headers: {
  //   Accept: "application/json",
  //   "Content-Type": "application/json",
  //   "X-Requested-With": "XMLHttpRequest",
  // },
  //   headers: { Authorization: `Bearer ${Auth.getAccessToken()}` },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Auth.getAccessToken();
    config.headers.Authorization = token ? `Bearer ${token}` : "";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setupAxiosInterceptors = (showError) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 403) {
        showError(
          error.response.data.message && error.response.data.service
            ? `You don't have permission to access ${error.response.data.service}`
            : "You don't have permission to access this Service/Action"
        );
      }
      return Promise.reject(error);
    }
  );
};
