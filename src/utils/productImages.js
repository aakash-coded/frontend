import { API_BASE_URL } from './api';
import { getProductPlaceholderUrl as buildCatalogImageUrl } from '../data/stationeryCatalog';

const BACKEND_BASE_URL = API_BASE_URL;
const DEFAULT_IMAGE_URL = buildCatalogImageUrl('Premium Stationery', 'Stationery');

export function getProductPlaceholderUrl(title, categoryName) {
  return buildCatalogImageUrl(title, categoryName);
}

function normalizeMediaUrl(src) {
  if (!src) return '';
  const trimmed = String(src).trim();

  if (trimmed.startsWith('/')) {
    return `${BACKEND_BASE_URL}${trimmed}`;
  }

  if (trimmed.startsWith('media/') || trimmed.startsWith('uploads/') || trimmed.startsWith('products/')) {
    return `${BACKEND_BASE_URL}/${trimmed}`;
  }

  return trimmed;
}

function isProjectMedia(src) {
  const value = String(src || '').trim();
  return value.startsWith('/media/')
    || value.includes('/media/')
    || value.startsWith('media/')
    || value.startsWith('uploads/')
    || value.startsWith('products/')
    || value.startsWith('data:image/');
}

function getProductCategory(product) {
  return product?.category_name || product?.category || 'Stationery';
}

export function getProductImageUrl(product) {
  if (!product) return DEFAULT_IMAGE_URL;

  if (product.image_url && isProjectMedia(product.image_url)) {
    return normalizeMediaUrl(product.image_url);
  }

  if (typeof product.image === 'string' && isProjectMedia(product.image)) {
    return normalizeMediaUrl(product.image);
  }

  if (product.image && typeof product.image === 'object' && product.image.url && isProjectMedia(product.image.url)) {
    return normalizeMediaUrl(product.image.url);
  }

  return getProductPlaceholderUrl(product.title, getProductCategory(product));
}

export function getCategoryImageUrl(categoryName, seed = categoryName) {
  return getProductPlaceholderUrl(seed || categoryName, categoryName);
}

export function getProductGalleryUrls(product) {
  if (!product) return [DEFAULT_IMAGE_URL];

  const baseImage = getProductImageUrl(product);
  const category = getProductCategory(product);
  const title = product.title || 'Stationery Product';
  const gallery = [
    baseImage,
    getProductPlaceholderUrl(`${title} Detail View`, category),
    getProductPlaceholderUrl(`${category} Essentials`, category),
  ];

  return Array.from(new Set(gallery)).slice(0, 4);
}
