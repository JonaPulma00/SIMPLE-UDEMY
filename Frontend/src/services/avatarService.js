const BASE_URL = import.meta.env.VITE_AVATAR_URL;

export const getAvatarUrl = ({
  name,
  background = "0D8ABC",
  color = "fff",
  size = "128",
}) => {
  return `${BASE_URL}?name=${name}&background=${background}&color=${color}&size=${size}`;
};
