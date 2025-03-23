// Set to local storage
export const setStorage = (key: string, value: string) =>
  localStorage.setItem(key, value);

// Get from local storage
export const getStorage = (key: string) => localStorage.getItem(key);

// Remove from local storage
export const removeStorage = (key: string) => localStorage.removeItem(key);