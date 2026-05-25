import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchProductDetails } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist } from '../redux/slices/wishlistSlice';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiCheck, FiStar, FiSend, FiTruck, FiShield, FiPackage } from 'react-icons/fi';
import { SkeletonDetail } from '../components/Skeletons';
import { getProductGalleryUrls, getProductImageUrl } from '../utils/productImages';
import axios from 'axios';
import toast from 'react-hot-toast';
import { buildUrl } from '../utils/api';

export function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
          aria-pressed={(hovered || value) >= n}
          onClick={() => onChange && onChange(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          className="text-2xl transition-transform hover:scale-110"
        >
          <span className={(hovered || value) >= n ? 'text-accent' : 'text-gray-300'}>★</span>
        </button>
      ))}
    </div>
  );
}

function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, items } = useSelector((state) => state.products);
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [zoomStyle, setZoomStyle] = useState({});
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    if (product) {
      const gallery = getProductGalleryUrls(product);
      setSelectedImage(gallery[0]);
    }
  }, [product]);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    fetchReviews();
    
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${selectedGalleryImage})`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => setZoomStyle({});

  const fetchReviews = async () => {
    setReviewLoading(true);
    try {
      const res = await axios.get(buildUrl(`/api/reviews/?product_id=${id}`));
      setReviews(res.data.results || res.data);
    } catch {
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
    toast.success(`${product.title} added to cart!`, { icon: '🛒' });
  };
  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product.id));
    toast.success('Added to wishlist!', { icon: '❤️' });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to submit a review'); return; }
    setSubmitting(true);
    try {
      await axios.post(buildUrl('/api/reviews/'), {
        product: id, rating, comment
      }, { headers: { Authorization: `Bearer ${token}` } });
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SkeletonDetail />
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 text-gray-500">Product not found.</div>;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const galleryImages = product ? getProductGalleryUrls(product) : [];
  const selectedGalleryImage = selectedImage || galleryImages[0] || getProductImageUrl(product);
  const similarProducts = items
    .filter((item) => item.category_name === product?.category_name && item.id !== product?.id)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-8 text-sm text-gray-400 flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.title}</span>
        </motion.div>

        {/* Product Main */}
        <div className="flex flex-col md:flex-row gap-12 mb-16">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <div 
                className="w-full h-[520px] bg-white relative cursor-crosshair overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={zoomStyle.backgroundImage ? zoomStyle : {}}
              >
                <img
                  src={selectedGalleryImage}
                  alt={product.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${zoomStyle.backgroundImage ? 'opacity-0' : 'opacity-100'}`}
                />
              </div>
              <div className="grid grid-cols-4 gap-2 p-3 bg-white">
                {galleryImages.map((src, idx) => (
                  <button
                    key={src + idx}
                    type="button"
                    aria-label={`View image ${idx + 1}`}
                    onClick={() => setSelectedImage(src)}
                    className={`rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedGalleryImage === src ? 'border-primary shadow-md shadow-primary/20 scale-95' : 'border-transparent hover:border-gray-300'} focus:outline-none`}
                  >
                    <img
                      src={src}
                      alt={`${product.title} ${idx + 1}`}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=900&q=80'; }}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
              {product.is_featured && (
                <span className="absolute top-5 left-5 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                  Best Seller
                </span>
              )}
            </motion.div>
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-accent font-bold tracking-widest uppercase text-sm mb-2">{product.brand}</p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Rating summary */}
              {avgRating && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating value={Math.round(avgRating)} />
                  <span className="text-sm text-gray-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
              )}

              <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
                <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                {product.discount_price && (
                  <span className="text-lg text-gray-400 line-through">₹{product.discount_price}</span>
                )}
                {product.stock_quantity > 0 ? (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">In Stock</span>
                ) : (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
                )}
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">{product.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Brand', value: product.brand || 'Sri Thanam' },
                  { label: 'Category', value: product.category_name || 'Stationery' },
                  { label: 'SKU', value: product.sku || 'STR-PAPER-001' },
                  { label: 'Availability', value: product.stock_quantity > 0 ? `In stock (${product.stock_quantity})` : 'Out of stock' },
                  { label: 'Price', value: `₹${product.price}` },
                  { label: 'Discount', value: product.discount_price ? `₹${product.discount_price}` : 'No discount' },
                ].map((field) => (
                  <div key={field.label} className="rounded-3xl bg-gray-50 p-4 border border-gray-100">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">{field.label}</p>
                    <p className="font-semibold text-gray-900">{field.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                {[
                  { icon: <FiTruck className="text-primary text-lg" />, label: 'Free Delivery', desc: 'On orders over ₹499' },
                  { icon: <FiShield className="text-primary text-lg" />, label: 'Quality Guarantee', desc: '100% authentic products' },
                  { icon: <FiPackage className="text-primary text-lg" />, label: 'Secure Packaging', desc: 'Safe & protected shipping' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">{item.icon}</div>
                    <p className="text-xs font-bold text-gray-900">{item.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-green-800 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <FiShoppingCart /> Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleAddToWishlist}
                  className="w-full sm:w-auto bg-gray-50 text-gray-700 py-4 px-6 rounded-full font-bold text-lg hover:bg-red-50 hover:text-red-500 border border-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <FiHeart /> Wishlist
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="border-t border-gray-100 pt-12 mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
                <p className="text-sm text-gray-500 mt-2">More premium stationery within the same collection.</p>
              </div>
              <Link to="/products" className="text-primary font-semibold hover:underline text-sm">Browse all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                  <img
                    src={getProductImageUrl(item)}
                    alt={item.title}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=900&q=80'; }}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <p className="text-sm uppercase text-accent tracking-[0.2em] mb-2">{item.category_name}</p>
                    <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">₹{item.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="border-t border-gray-100 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Review List & Distribution */}
            <div className="lg:w-1/2 space-y-8">
              {/* Rating Distribution */}
              {!reviewLoading && reviews.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl font-black text-gray-900">{avgRating}</div>
                    <div>
                      <StarRating value={Math.round(avgRating)} />
                      <p className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                          <span className="w-12 text-gray-600 font-medium">{star} stars</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              transition={{ duration: 1, type: "spring" }}
                              className="h-full bg-accent" 
                            />
                          </div>
                          <span className="w-8 text-right text-gray-400">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviewLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
                    <p className="text-2xl mb-2">✍️</p>
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                            {review.user_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{review.user_name}</p>
                            <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <StarRating value={review.rating} />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Write a Review */}
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold mb-1">Write a Review</h3>
                <p className="text-gray-500 text-sm mb-6">Share your honest experience with this product</p>
                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-3">🔐</p>
                    <p className="text-gray-500 mb-4">You need to be logged in to leave a review</p>
                    <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition-colors inline-block">
                      Login to Review
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                      <StarRating value={rating} onChange={setRating} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={5}
                        required
                        placeholder="What did you love? What could be better?"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white resize-none text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary text-white py-3 rounded-full font-bold hover:bg-green-800 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      <FiSend /> {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: showStickyBar ? 0 : 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 py-3 px-4 sm:px-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4 hidden sm:flex">
          <img
            src={selectedGalleryImage}
            alt={product.title}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=900&q=80'; }}
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <p className="font-bold text-gray-900 text-sm">{product.title}</p>
            <p className="text-primary font-bold text-sm">₹{product.price}</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto ml-auto">
          <button
            onClick={handleAddToWishlist}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:text-red-500 hover:bg-red-50 transition"
          >
            <FiHeart />
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 sm:flex-none bg-primary text-white py-2 px-8 rounded-full font-bold hover:bg-green-800 transition shadow flex items-center justify-center gap-2"
          >
            <FiShoppingCart /> Add to Cart
          </button>
        </div>
      </motion.div>

    </div>
  );
}

export default ProductDetailsPage;
