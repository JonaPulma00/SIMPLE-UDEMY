const BASE_URL = import.meta.env.VITE_AVATAR_URL;

export const getAvatarUrl = ({ name, background, color, size }) => {
  return `${BASE_URL}?name=${name}&background=${background}&color=${color}&size=${size}`;
};
