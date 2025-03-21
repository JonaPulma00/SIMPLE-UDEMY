import axios from "axios";
// import { config } from "../config/appConfig";

export const saveTokens = (access_token, refresh_token) => {
  sessionStorage.setItem("access_token", access_token);
  sessionStorage.setItem("refresh_token", refresh_token);
};

export const getToken = () => {
  return sessionStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  return sessionStorage.getItem("refresh_token");
};

export const refreshToken = () => {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return Promise.reject("No refresh token available");
  return axios.post(`${config.BASE_API_URL}/auth/refresh`, { refresh_token });
};

export const deleteTokens = () => {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
};

export const logoutApp = () => {
  deleteTokens();
};
