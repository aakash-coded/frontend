import { API_BASE_URL } from './api';

const BACKEND_BASE_URL = API_BASE_URL;

const CATEGORY_IMAGE_MAP = {
  Notebooks: [
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1492914539999-22da39e0fedd?auto=format&fit=crop&w=900&q=80',
  ],
  'Pens & Pencils': [
    'https://images.unsplash.com/photo-1510541935310-53dd69f5f1f2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=900&q=80',
  ],
  'Office Supplies': [
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  ],
  'Art Materials': [
    'https://images.unsplash.com/photo-1519589744378-5dcc9f8d765d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3b3d13?auto=format&fit=crop&w=900&q=80',
  ],
  'School Supplies': [
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1533227268428-f9ed0900fb96?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  ],
  'Eco-Friendly': [
    'https://images.unsplash.com/photo-1556912990-8ef286e2cb03?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  ],
  Diaries: [
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
  ],
  'Craft Items': [
    'https://images.unsplash.com/photo-1519834789131-5b0ab6494f36?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80',
  ],
};

const TITLE_IMAGE_MAP = [
  {
    keywords: ['fountain pen', 'pen', 'pencil', 'marker', 'highlighter'],
    urls: [
      'https://images.unsplash.com/photo-1516542076529-1ea3854896fe?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    keywords: ['notes', 'note', 'notebook', 'journal', 'planner', 'diary', 'notepad', 'register'],
    urls: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    keywords: ['paper', 'a4', 'bundle', 'register', 'printer'],
    urls: [
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    keywords: ['sticky note', 'sticky', 'stationery', 'desk', 'organizer'],
    urls: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1495570282522-036a9542ee25?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    keywords: ['art', 'sketchbook', 'paint', 'brush', 'craft'],
    urls: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80',
    ],
  },
];

const GALLERY_IMAGE_MAP = {
  Notebooks: [
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
  ],
  'Pens & Pencils': [
    'https://images.unsplash.com/photo-1510541935310-53dd69f5f1f2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
  ],
  'Office Supplies': [
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&q=80',
  ],
  'Art Materials': [
    'https://images.unsplash.com/photo-1519589744378-5dcc9f8d765d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80',
  ],
  'School Supplies': [
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1533227268428-f9ed0900fb96?auto=format&fit=crop&w=1200&q=80',
  ],
  'Eco-Friendly': [
    'https://images.unsplash.com/photo-1556912990-8ef286e2cb03?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  ],
};

const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=900&q=80';

function normalizeImageUrl(src) {
  if (!src) return DEFAULT_IMAGE_URL;
  const trimmed = String(src).trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return `${BACKEND_BASE_URL}${trimmed}`;
  }
  if (trimmed.startsWith('media/') || trimmed.startsWith('uploads/')) {
    return `${BACKEND_BASE_URL}/${trimmed}`;
  }
  return trimmed;
}

function stableHash(value) {
  let hash = 0;
  const str = String(value || '').trim();
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function chooseImage(imageList, seed) {
  if (!Array.isArray(imageList) || imageList.length === 0) {
    return DEFAULT_IMAGE_URL;
  }
  const index = stableHash(seed || imageList[0]) % imageList.length;
  return imageList[index];
}

export function getCategoryImageUrl(categoryName, seed) {
  const images = CATEGORY_IMAGE_MAP[categoryName];
  if (images) {
    return chooseImage(images, seed);
  }
  return DEFAULT_IMAGE_URL;
}

export function getProductImageUrl(product) {
  if (!product) return DEFAULT_IMAGE_URL;
  if (product.image_url) return normalizeImageUrl(product.image_url);
  if (product.image && typeof product.image === 'string') {
    return normalizeImageUrl(product.image);
  }
  if (product.image && typeof product.image === 'object' && product.image.url) {
    return normalizeImageUrl(product.image.url);
  }

  const title = String(product.title || '').toLowerCase();
  for (const mapping of TITLE_IMAGE_MAP) {
    if (mapping.keywords.some((keyword) => title.includes(keyword))) {
      return chooseImage(mapping.urls, title);
    }
  }

  const category = String(product.category_name || product.category || '').trim();
  return getCategoryImageUrl(category, title);
}

export function getProductGalleryUrls(product) {
  if (!product) return [DEFAULT_IMAGE_URL];
  const baseImage = getProductImageUrl(product);
  const category = String(product.category_name || product.category || '').trim();
  const gallery = [baseImage];

  if (category && GALLERY_IMAGE_MAP[category]) {
    gallery.push(...GALLERY_IMAGE_MAP[category]);
  }

  const title = String(product.title || '').toLowerCase();
  TITLE_IMAGE_MAP.forEach((mapping) => {
    if (mapping.keywords.some((keyword) => title.includes(keyword))) {
      gallery.push(...mapping.urls);
    }
  });

  const uniqueGallery = Array.from(new Set(gallery));
  return uniqueGallery.slice(0, 4);
}
