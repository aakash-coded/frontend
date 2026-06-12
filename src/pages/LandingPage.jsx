import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist } from '../redux/slices/wishlistSlice';
import { STATIONERY_PRODUCTS } from '../data/stationeryCatalog';
import ProductCard from '../components/ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const heroSlides = [
  {
    title: 'Notes, Notebooks & Journals',
    subtitle: 'Explore premium notebooks, planners, and paper that inspire every idea.',
    cta: 'Shop Notebooks',
    link: '/products',
    badge: 'Notebook collection',
    image: '/carousel/notebooks-journals.png',
  },
  {
    title: 'Pens, Pencils, and Desk Essentials',
    subtitle: 'Find beautifully crafted writing tools and stationery for every desk.',
    cta: 'Browse Pens',
    link: '/products',
    badge: 'Writing essentials',
    image: '/carousel/pens-pencils.png',
  },
  {
    title: 'Desk & Office Essentials',
    subtitle: 'Shop organized stationery bundles for study, work, and everyday planning.',
    cta: 'Explore Sets',
    link: '/products',
    badge: 'Workspace ready',
    image: '/carousel/office-essentials.png',
  },
];

function LandingPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts(''));
  }, [dispatch]);

  const catalogItems = items.length ? items : STATIONERY_PRODUCTS;
  const hasUploadedImage = (product) => {
    const image = String(product.image || product.image_url || '');
    return image.includes('/media/') || image.startsWith('products/') || image.startsWith('media/');
  };
  const uniqueProducts = (products) => products.filter((product, index, list) => (
    list.findIndex((item) => String(item.id) === String(product.id)) === index
  ));
  const featuredProducts = uniqueProducts([
    ...catalogItems.filter((product) => product.is_featured && hasUploadedImage(product)),
    ...catalogItems.filter((product) => hasUploadedImage(product)),
    ...catalogItems.filter((product) => product.is_featured),
    ...catalogItems.filter((product) => ['Premium Fountain Pen', 'Executive Meeting Notebook', 'Desk Organizer', 'A4 Copier Paper Ream'].includes(product.title)),
  ]).slice(0, 4);
  const featuredIds = new Set(featuredProducts.map((product) => String(product.id)));
  const imageBackedProducts = catalogItems.filter((product) => hasUploadedImage(product) && !featuredIds.has(String(product.id)));
  const newArrivals = uniqueProducts([
    ...imageBackedProducts.slice().reverse(),
    ...catalogItems.filter((product) => !featuredIds.has(String(product.id))),
  ]).slice(0, 4);

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const handleAddToWishlist = (event, product) => {
    event.preventDefault();
    dispatch(addToWishlist(product.id));
  };

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="landing-hero-swiper max-w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={slide.title}>
              <div className="relative flex min-h-0 items-center py-8 pb-12 sm:min-h-[640px] sm:py-16 lg:min-h-[700px]">
                <div className="absolute inset-0">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_56%,#064e3b_100%)]" />
                </div>

                <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12">
                    <div className="mx-auto max-w-md text-center sm:max-w-3xl sm:text-left">
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="mb-3 inline-block rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-accent sm:mb-5 sm:px-4 sm:py-2 sm:text-sm sm:tracking-[0.18em]"
                      >
                        {slide.badge}
                      </motion.span>
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 + index * 0.05 }}
                        className="mb-3 text-2xl font-black leading-tight tracking-normal sm:mb-6 sm:text-6xl lg:text-7xl"
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 + index * 0.05 }}
                        className="mx-auto mb-5 max-w-sm text-sm leading-6 text-slate-100 sm:mx-0 sm:mb-8 sm:max-w-2xl sm:text-xl sm:leading-8"
                      >
                        {slide.subtitle}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 + index * 0.05 }}
                        className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:flex sm:flex-row sm:gap-4"
                      >
                        <Link to={slide.link} className="rounded-xl bg-accent px-5 py-3 text-center text-sm font-black text-slate-950 shadow-xl shadow-accent/25 transition hover:bg-amber-300 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base">
                          {slide.cta}
                        </Link>
                        <Link to="/products" className="rounded-xl border border-white/30 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base">
                          Browse Products
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 + index * 0.05 }}
                        className="mt-10 hidden max-w-2xl grid-cols-3 gap-5 border-t border-white/15 pt-6 sm:grid"
                      >
                        <div>
                          <p className="text-2xl font-black text-white">50+</p>
                          <p className="mt-1 text-sm text-slate-300">Curated essentials</p>
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">Fast</p>
                          <p className="mt-1 text-sm text-slate-300">Local dispatch</p>
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">Premium</p>
                          <p className="mt-1 text-sm text-slate-300">Paper finishes</p>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, x: 24, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.7, delay: 0.25 + index * 0.05 }}
                      className="relative mx-auto w-full max-w-[17rem] sm:max-w-lg lg:max-w-none"
                    >
                      <div className="absolute -inset-3 rounded-3xl bg-white/10 blur-2xl sm:-inset-5 sm:rounded-[2rem]" />
                      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white p-2 shadow-2xl sm:rounded-[2rem] sm:p-3">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="aspect-[4/3] w-full rounded-2xl object-cover sm:rounded-[1.5rem]"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Editor's picks</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-4xl">Featured Products</h2>
            </div>
            <Link to="/products" className="text-sm font-black text-primary hover:underline">View All -&gt;</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-slate-200" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Fresh stock</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-4xl">New Arrivals</h2>
            </div>
            <Link to="/products" className="text-sm font-black text-primary hover:underline">View All -&gt;</Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
