export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const normalizeUrl = (url) => url.replace(/\/+$|^\/+/, '');

export const buildUrl = (path) => {
  const base = normalizeUrl(API_BASE_URL);
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/${cleanPath}`;
};
