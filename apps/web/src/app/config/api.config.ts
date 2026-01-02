export const API_BASE_URL = 'http://localhost:3000';

const AUTHOR_ID_STORAGE_KEY = 'reflecta_author_id';

const getStorage = () => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage;
};

export const getAuthorId = () => {
  const storage = getStorage();
  return storage?.getItem(AUTHOR_ID_STORAGE_KEY) ?? '';
};

export const setAuthorId = (value: string) => {
  const storage = getStorage();
  if (!storage) return;
  if (value) {
    storage.setItem(AUTHOR_ID_STORAGE_KEY, value);
  } else {
    storage.removeItem(AUTHOR_ID_STORAGE_KEY);
  }
};
