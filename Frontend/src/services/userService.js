import api from "../interceptor/authInterceptor";
import { getToken, deleteToken } from "./tokenService";

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    if (response.status === 200) {
      deleteToken();
    }
    return response;
  } catch (error) {
    console.error("Error logging out: ", error);
    throw error;
  }
};
