export const createLocalStorage = () => {
  const storage = {};
  const localStorage = {
    setItem(k, v) {
      storage[k] = v;
    },
    getItem(k) {
      return storage[k];
    },
    removeItem(k) {
      delete storage[k];
    }
  };
  return localStorage;
};