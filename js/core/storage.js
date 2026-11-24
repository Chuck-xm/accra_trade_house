export const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(`ath-${key}`)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`ath-${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};
