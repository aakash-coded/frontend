import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiHeart, FiPackage, FiSend, FiShield, FiShoppingCart, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchProductDetails, fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist } from '../redux/slices/wishlistSlice';
import { SkeletonDetail } from '../components/Skeletons';
import ProductCard from '../components/ProductCard';
import { STATIONERY_PRODUCTS } from '../data/stationeryCatalog';
import { getProductGalleryUrls, getProductImageUrl } from '../utils/productImages';
import { buildUrl } from '../utils/api';
import { formatCurrency } from '../utils/formatters';

export function StarRating({ value = 0, onChange, size = 'text-2xl' }) {
  const [hovered, setHovered] = useState(0);
  const activeValue = hovered || value;

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((ratingValue) => (
        <button
          key={ratingValue}
          type="button"
          aria-label={`Rate ${ratingValue} star${ratingValue > 1 ? 's' : ''}`}
          aria-pressed={activeValue >= ratingValue}
          onClick={() => onChange && onChange(ratingValue)}
          onMouseEnter={() => onChange && setHovered(ratingValue)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`${size} leading-none transition-transform ${onChange ? 'hover:scale-110' : 'cursor-default'}`}
          disabled={!onChange}
        >
          <span className={activeValue >= ratingValue ? 'text-accent' : 'text-slate-300'}>{'\u2605'}</span>
        </button>
      ))}
    </div>
  );
}

function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product: apiProduct, loading, items } = useSelector((state) => state.products);
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  const catalogProduct = useMemo(() => STATIONERY_PRODUCTS.find((item) => String(item.id) === String(id)), [id]);
  const product = catalogProduct || apiProduct;

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [zoomStyle, setZoomStyle] = useState({});
  const [showStickyBar, setShowStickyBar] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (catalogProduct) {
      setReviews([]);
      setReviewLoading(false);
      return;
    }

    setReviewLoading(true);
    try {
      const response = await axios.get(buildUrl(`/api/reviews/?product_id=${id}`));
      setReviews(response.data.results || response.data);
    } catch {
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  }, [catalogProduct, id]);

  useEffect(() => {
    if (catalogProduct) {
      dispatch(fetchProducts(''));
    } else {
      dispatch(fetchProductDetails(id));
      dispatch(fetchProducts(''));
    }
    fetchReviews();

    const handleScroll = () => setShowStickyBar(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [catalogProduct, dispatch, fetchReviews, id]);

  useEffect(() => {
    setSelectedImage('');
    setZoomStyle({});
  }, [id]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : null;

  const galleryImages = product ? getProductGalleryUrls(product) : [];
  const selectedGalleryImage = selectedImage || galleryImages[0] || (product ? getProductImageUrl(product) : '');
  const relatedPool = items.length ? items : STATIONERY_PRODUCTS;
  const similarProducts = relatedPool
    .filter((item) => item.category_name === product?.category_name && String(item.id) !== String(product?.id))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    dispatch(addToWishlist(product.id));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }
    if (catalogProduct) {
      toast.error('Reviews are available for catalog products after they are synced to the backend.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        buildUrl('/api/reviews/'),
        { product: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success('Review submitted!');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMouseMove = (event) => {
    if (!selectedGalleryImage) return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${selectedGalleryImage})`,
      backgroundSize: '200%',
    });
  };

  if (loading && !catalogProduct) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <SkeletonDetail />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-slate-800">Product not found</h1>
        <p className="mt-3 text-slate-500">The item may be unavailable or no longer listed.</p>
        <Link to="/products" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-black text-white">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 pt-8 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link to="/" className="transition hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="transition hover:text-primary">Products</Link>
          <span>/</span>
          <span className="max-w-[220px] truncate font-bold text-slate-700">{product.title}</span>
        </motion.div>

        <div className="mb-14 grid gap-8 md:grid-cols-2 lg:gap-12">
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            <div
              className="relative h-[320px] cursor-crosshair overflow-hidden bg-white sm:h-[440px] lg:h-[520px]"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomStyle({})}
              style={zoomStyle.backgroundImage ? zoomStyle : {}}
            >
              <img
                src={selectedGalleryImage}
                alt={product.title}
                className={`h-full w-full object-cover transition-opacity duration-300 ${zoomStyle.backgroundImage ? 'opacity-0' : 'opacity-100'}`}
              />
              {product.is_featured && (
                <span className="absolute left-5 top-5 rounded-full bg-accent px-4 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-950 shadow">
                  Best Seller
                </span>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 bg-white p-3">
                {galleryImages.map((src, index) => (
                  <button
                    key={src + index}
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    onClick={() => setSelectedImage(src)}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      selectedGalleryImage === src ? 'border-primary shadow-md shadow-primary/20' : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img src={src} alt={`${product.title} ${index + 1}`} className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-accent">{product.brand || 'Sri Thanam Papers'}</p>
            <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {product.title}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-slate-100 pb-6">
              {avgRating ? (
                <>
                  <StarRating value={Math.round(avgRating)} size="text-xl" />
                  <span className="text-sm font-bold text-slate-500">
                    {avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">No reviews yet</span>
              )}
              {product.stock_quantity > 0 ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">In Stock</span>
              ) : (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">Out of Stock</span>
              )}
            </div>

            <div className="mb-6 flex flex-wrap items-end gap-4">
              <span className="text-4xl font-black text-primary">{formatCurrency(product.price)}</span>
              {product.discount_price && (
                <span className="text-lg font-bold text-slate-400 line-through">{formatCurrency(product.discount_price)}</span>
              )}
            </div>

            <p className="mb-8 text-base leading-8 text-slate-600 sm:text-lg">{product.description}</p>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: 'Brand', value: product.brand || 'Sri Thanam Papers' },
                { label: 'Category', value: product.category_name || 'Stationery' },
                { label: 'SKU', value: product.sku || 'STR-PAPER-001' },
                { label: 'Availability', value: product.stock_quantity > 0 ? `In stock (${product.stock_quantity})` : 'Out of stock' },
              ].map((field) => (
                <div key={field.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">{field.label}</p>
                  <p className="font-black text-slate-900">{field.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
              {[
                { icon: <FiTruck className="text-primary" />, label: 'Free Delivery', desc: `On orders over ${formatCurrency(499)}` },
                { icon: <FiShield className="text-primary" />, label: 'Quality Guarantee', desc: 'Authentic products' },
                { icon: <FiPackage className="text-primary" />, label: 'Secure Packaging', desc: 'Safe shipping' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">{item.icon}</div>
                  <p className="text-xs font-black text-slate-950">{item.label}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800"
              >
                <FiShoppingCart /> Add to Cart
              </button>
              <button
                type="button"
                onClick={handleAddToWishlist}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 text-lg font-black text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <FiHeart /> Wishlist
              </button>
            </div>
          </motion.div>
        </div>

        {similarProducts.length > 0 && (
          <section className="mb-14 border-t border-slate-100 pt-12">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Related picks</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Similar Products</h2>
              </div>
              <Link to="/products" className="text-sm font-black text-primary hover:underline">Browse all -&gt;</Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onAddToCart={(event, selectedProduct) => {
                    event.preventDefault();
                    dispatch(addToCart({ productId: selectedProduct.id, quantity: 1 }));
                  }}
                  onAddToWishlist={(event, selectedProduct) => {
                    event.preventDefault();
                    dispatch(addToWishlist(selectedProduct.id));
                  }}
                />
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-slate-100 pt-12">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Customer voice</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Reviews & Ratings</h2>
            </div>
            {avgRating && <p className="text-sm font-bold text-slate-500">Average rating: {avgRating}/5</p>}
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              {!reviewLoading && reviews.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="text-5xl font-black text-slate-950">{avgRating}</div>
                    <div>
                      <StarRating value={Math.round(avgRating)} size="text-xl" />
                      <p className="mt-1 text-sm font-semibold text-slate-500">Based on {reviews.length} reviews</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((review) => review.rating === star).length;
                      const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="grid grid-cols-[4rem_1fr_2rem] items-center gap-3 text-sm">
                          <span className="font-bold text-slate-600">{star} stars</span>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              transition={{ duration: 0.7 }}
                              className="h-full rounded-full bg-accent"
                            />
                          </div>
                          <span className="text-right font-bold text-slate-400">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {reviewLoading ? (
                  [1, 2].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-slate-100" />)
                ) : reviews.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                    <p className="text-lg font-black text-slate-700">No reviews yet</p>
                    <p className="mt-2 text-sm">Be the first to review this product.</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <motion.article
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-primary">
                            {review.user_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-950">{review.user_name || 'Customer'}</p>
                            <p className="text-xs font-semibold text-slate-400">
                              {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <StarRating value={review.rating} size="text-lg" />
                      </div>
                      <p className="text-sm leading-7 text-slate-600">{review.comment}</p>
                    </motion.article>
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm sm:p-8 lg:sticky lg:top-28">
                <h3 className="text-xl font-black text-slate-950">Write a Review</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Share your honest experience with this product.</p>
                {!isAuthenticated ? (
                  <div className="py-8 text-center">
                    <p className="mb-4 text-slate-500">You need to be logged in to leave a review.</p>
                    <Link to="/login" className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-black text-white transition hover:bg-green-800">
                      Login to Review
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="mt-6 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-black text-slate-700">Your Rating</label>
                      <StarRating value={rating} onChange={setRating} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-black text-slate-700">Your Review</label>
                      <textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        rows={5}
                        required
                        placeholder="What did you love? What could be better?"
                        className="focus-ring w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800 disabled:opacity-70"
                    >
                      <FiSend /> {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showStickyBar ? 0 : 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_40px_rgba(15,23,42,0.08)] backdrop-blur-md sm:px-6"
      >
        <div className="hidden min-w-0 items-center gap-4 sm:flex">
          <img src={selectedGalleryImage} alt={product.title} className="h-12 w-12 rounded-xl object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-950">{product.title}</p>
            <p className="text-sm font-black text-primary">{formatCurrency(product.price)}</p>
          </div>
        </div>
        <div className="flex w-full gap-3 sm:ml-auto sm:w-auto">
          <button
            type="button"
            onClick={handleAddToWishlist}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Add to wishlist"
          >
            <FiHeart />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800 sm:flex-none"
          >
            <FiShoppingCart /> Add to Cart
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ProductDetailsPage;
