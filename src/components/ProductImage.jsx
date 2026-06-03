import { useEffect, useState } from 'react';
import { getProductImageUrl, getProductPlaceholderUrl } from '../utils/productImages';

function ProductImage({
  product,
  alt,
  className = '',
  containerClassName = '',
  loading = 'lazy',
}) {
  const fallback = getProductPlaceholderUrl(product?.title, product?.category_name || product?.category);
  const [src, setSrc] = useState(getProductImageUrl(product));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(getProductImageUrl(product));
    setFailed(false);
  }, [product]);

  const handleError = () => {
    if (!failed) {
      setFailed(true);
      setSrc(fallback);
    }
  };

  return (
    <div className={`bg-gray-100 overflow-hidden ${containerClassName}`}>
      <img
        src={src}
        alt={alt || product?.title || 'Stationery product'}
        loading={loading}
        decoding="async"
        onError={handleError}
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
}

export default ProductImage;
