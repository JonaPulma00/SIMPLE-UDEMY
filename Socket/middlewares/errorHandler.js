export const errorHandler = (handler) => {
  const handleError = (err) => {
    console.error("please handle me", err);
  };
  return (...args) => {
    try {
      const ret = handler.apply(this, args);
      if (ret && typeof ret.catch === "function") {
        ret.catch(handleError);
      }
    } catch (e) {
      handleError(e);
    }
  };
};
