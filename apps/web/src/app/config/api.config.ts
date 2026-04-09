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

// Theme helpers
const THEME_STORAGE_KEY = 'reflecta_theme';
export type ThemePreference = 'light' | 'dark' | 'system';

export const getThemePreference = (): ThemePreference => {
  const storage = getStorage();
  const value = storage?.getItem(THEME_STORAGE_KEY);
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return 'system';
};

export const setThemePreference = (value: ThemePreference) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(THEME_STORAGE_KEY, value);
  applyTheme(value);
};

export const applyTheme = (preference: ThemePreference) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (preference === 'dark') {
    root.classList.add('dark');
  } else if (preference === 'light') {
    root.classList.remove('dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
};
