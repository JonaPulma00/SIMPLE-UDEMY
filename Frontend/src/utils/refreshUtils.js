export const refreshData = (setRefreshKey) => {
  return () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };
};

export const debouncedRefresh = (setRefreshKey, delay = 500) => {
  let timeoutId;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setRefreshKey((prevKey) => prevKey + 1);
    }, delay);
  };
};
