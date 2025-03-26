import { useState } from "react";
export const useForm = (initialForm = {}) => {
  const [formState, setformState] = useState(initialForm);

  const onInputChange = ({ target }) => {
    const value = target.type === "checkbox" ? target.checked : target.value;
    setformState({
      ...formState,
      [target.name]: value,
    });
  };

  return { ...formState, formState, onInputChange };
};
