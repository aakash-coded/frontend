import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToWishlist } from '../redux/slices/wishlistSlice';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { getProductImageUrl } from '../utils/productImages';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const heroSlides = [
  {
    title: 'Notes, Notebooks & Journals',
    subtitle: 'Explore premium notebooks, planners, and paper that inspire every idea.',
    cta: 'Shop Notebooks',
    link: '/products',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Pens, Pencils, and Desk Essentials',
    subtitle: 'Find beautifully crafted writing tools and stationery for every desk.',
    cta: 'Browse Pens',
    link: '/products',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Books, Paper & Creative Sets',
    subtitle: 'Shop curated stationery bundles for study, work, and art.',
    cta: 'Explore Sets',
    link: '/products',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Luxury Stationery for Every Project',
    subtitle: 'Elevate your workspace with premium paper, cards, and writing supplies.',
    cta: 'View Collections',
    link: '/products',
    image: 'https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=1400&q=80',
  },
];


function LandingPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts(''));
  }, [dispatch]);

  const featuredProducts = items.filter(p => p.is_featured).slice(0, 4);
  const newArrivals = items.slice(0, 4);

  return (
    <div className="flex flex-col">

      {/* ── Hero Carousel ── */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="max-w-full mx-auto"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={slide.title}>
              <div className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center">
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-slate-950/70" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="text-center lg:text-left">
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-5"
                      >
                        {index === 0 ? '🎉 Grand Sale' : 'New Arrival'}
                      </motion.span>
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 + index * 0.05 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 + index * 0.05 }}
                        className="max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl text-slate-100 mb-8"
                      >
                        {slide.subtitle}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 + index * 0.05 }}
                        className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
                      >
                        <Link
                          to={slide.link}
                          className="bg-gradient-to-r from-accent to-yellow-400 text-slate-950 font-semibold px-8 py-4 rounded-full shadow-xl shadow-accent/30 hover:from-yellow-300 hover:to-yellow-500 transition"
                        >
                          {slide.cta}
                        </Link>
                        <Link
                          to="/products"
                          className="border border-white/25 text-white px-8 py-4 rounded-full hover:bg-white/10 transition"
                        >
                          Browse Products
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 + index * 0.05 }}
                        className="mt-8 grid gap-4 sm:grid-cols-2"
                      >
                        <div className="glass p-5 rounded-3xl border border-white/10 shadow-2xl shadow-black/15">
                          <p className="text-sm uppercase text-accent tracking-[0.3em] mb-3">Premium features</p>
                          <ul className="space-y-2 text-sm text-slate-100">
                            <li>• Luxury paper finishes</li>
                            <li>• Curated stationery bundles</li>
                          </ul>
                        </div>
                        <div className="glass p-5 rounded-3xl border border-white/10 shadow-2xl shadow-black/15">
                          <p className="text-sm uppercase text-accent tracking-[0.3em] mb-3">Fast delivery</p>
                          <ul className="space-y-2 text-sm text-slate-100">
                            <li>• Express shipping options</li>
                            <li>• Easy returns and support</li>
                          </ul>
                        </div>
                      </motion.div>
                    </div>
                    <div className="hidden lg:block">
                      <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30 border border-white/10">
                        <img
                          src={`https://picsum.photos/seed/hero-shot-${index + 1}/900/780`}
                          alt="Hero visual"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <div className="w-24 h-1 bg-accent mt-4 rounded-full" />
            </div>
            <Link to="/products" className="text-primary font-semibold hover:underline">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} dispatch={dispatch} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              <div className="w-24 h-1 bg-primary mt-4 rounded-full" />
            </div>
            <Link to="/products" className="text-primary font-semibold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} dispatch={dispatch} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

function ProductCard({ product, dispatch }) {
  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(addToWishlist(product.id));
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="block h-48 bg-gray-50 rounded-xl mb-4 overflow-hidden relative">
        <img
          src={getProductImageUrl(product)}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-accent text-white px-2 py-0.5 rounded-full text-xs font-bold">Hot</span>
        )}
        <button
          type="button"
          aria-label="Add product to wishlist"
          onClick={handleWishlist}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
        >
          <FiHeart className="w-4 h-4" />
        </button>
      </Link>
      <div className="px-1 flex-grow flex flex-col">
        <p className="text-xs text-accent font-bold uppercase tracking-wider mb-1">{product.category_name}</p>
        <Link to={`/product/${product.id}`} className="font-semibold text-gray-900 text-base leading-tight mb-3 line-clamp-2 hover:text-primary transition-colors flex-grow">
          {product.title}
        </Link>
        <div className="flex justify-between items-center mt-auto">
          <p className="font-bold text-lg text-primary">₹{product.price}</p>
          <Link
            to={`/product/${product.id}`}
            className="bg-primary/10 text-primary p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            <FiShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default LandingPage;
