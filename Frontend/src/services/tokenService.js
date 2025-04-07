export const saveToken = (access_token) => {
  sessionStorage.setItem("access_token", access_token);
};

export const getToken = () => {
  return sessionStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  return sessionStorage.getItem("refresh_token");
};

export const deleteToken = () => {
  sessionStorage.removeItem("access_token");
};

export const isAuth = () => {
  return !!getToken();
};
export const logoutApp = () => {
  deleteToken();
};
