import axios from "axios";
import { config } from "../config/appConfig";

export const registerUser = {
  register: (user, email, password) => {
    return axios.post(`${config.BASE_API_URL}/auth/register`, {
      user,
      email,
      password,
    });
  },
};
