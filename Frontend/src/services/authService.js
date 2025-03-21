import axios from "axios";
import { saveTokens } from "./tokenService";

// import { config } from "../config/appConfig";

let access_token = "";
let refresh_token = "";
let user;
export const registerUser = {
  register: (formData) => {
    return axios.post(`http://127.0.0.1:8000/api/v1/auth/register`, formData);
  },
};

export const loginUser = {
  login: (formData) => {
    return axios
      .post(`http://127.0.0.1:8000/api/v1/auth/login`, formData)
      .then((response) => {
        if (response.data.access_token && response.data.refresh_token) {
          saveTokens(response.data.access_token, response.data.refresh_token);
        }
      })
      .catch((error) => {
        console.error("Login failed: ", error);
      });
  },
};
