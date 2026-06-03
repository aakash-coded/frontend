import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiShoppingCart } from 'react-icons/fi';
import ProductImage from './ProductImage';
import { formatCurrency } from '../utils/formatters';

function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  variant = 'grid',
}) {
  const productPath = `/product/${product.id}`;
  const description = product.description || 'Premium stationery selected for study, work, and creative desks.';

  if (variant === 'list') {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.25 }}
        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-xl"
      >
        <div className="grid gap-0 sm:grid-cols-[13rem_1fr]">
          <Link to={productPath} className="block min-h-56 overflow-hidden bg-slate-100 sm:min-h-full">
            <ProductImage
              product={product}
              containerClassName="h-full min-h-56"
              className="transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
          <div className="flex min-w-0 flex-col justify-between gap-5 p-5 sm:p-6">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                {product.category_name || 'Stationery'}
              </p>
              <Link to={productPath} className="text-xl font-bold leading-tight text-slate-950 transition-colors hover:text-primary">
                {product.title}
              </Link>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{description}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-2xl font-black text-primary">{formatCurrency(product.price)}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={(event) => onAddToCart?.(event, product)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-green-800"
                >
                  <FiShoppingCart /> Add
                </button>
                <button
                  type="button"
                  onClick={(event) => onAddToWishlist?.(event, product)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  aria-label="Add to wishlist"
                >
                  <FiHeart />
                </button>
                <Link
                  to={productPath}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
                  aria-label="View product details"
                >
                  <FiEye />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.25 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"
    >
      <Link to={productPath} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <ProductImage
          product={product}
          containerClassName="h-full"
          className="transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
          {product.category_name || 'Stationery'}
        </span>
        {product.is_featured && (
          <span className="absolute bottom-3 left-3 rounded-full bg-accent px-3 py-1 text-xs font-black text-slate-950 shadow-sm">
            Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={productPath} className="line-clamp-2 text-base font-bold leading-snug text-slate-950 transition-colors hover:text-primary">
          {product.title}
        </Link>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-xl font-black text-primary">{formatCurrency(product.price)}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => onAddToWishlist?.(event, product)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              aria-label="Add to wishlist"
            >
              <FiHeart />
            </button>
            <button
              type="button"
              onClick={(event) => onAddToCart?.(event, product)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition hover:bg-green-800"
              aria-label="Add to cart"
            >
              <FiShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
