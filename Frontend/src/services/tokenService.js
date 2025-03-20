import axios from "axios";
import { config } from "../config/appConfig";

export const saveTokens = () => {
  sessionStorage.setItem("auth_token");
  sessionStorage.setItem("refresh_token");
};

export const getToken = () => {
  sessionStorage.getItem("auth_token");
};

export const getRefreshToken = () => {
  sessionStorage.getItem("refresh_token");
};

export const refreshToken = () => {
  const refreshToken = getRefreshToken();
  return axios.post(`${config.BASE_API_URL}/auth/refresh`, refreshToken);
};

export const deleteTokens = () => {
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("refresh_token");
};
