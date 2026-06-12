import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiFilter, FiGrid, FiList, FiSearch, FiX } from 'react-icons/fi';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist } from '../redux/slices/wishlistSlice';
import { SkeletonCard } from '../components/Skeletons';
import ProductCard from '../components/ProductCard';
import { STATIONERY_CATEGORIES, STATIONERY_PRODUCTS } from '../data/stationeryCatalog';
import { formatCurrency } from '../utils/formatters';

const SORT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
];

function mergeWithStationeryCatalog(items) {
  const seenTitles = new Set((items || []).map((item) => String(item.title || '').toLowerCase()));
  const missingProducts = STATIONERY_PRODUCTS.filter((product) => !seenTitles.has(product.title.toLowerCase()));
  return [...(items || []), ...missingProducts].slice(0, 50);
}

function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, loading } = useSelector((state) => state.products);
  const searchQueryParam = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(searchQueryParam);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setSearchTerm(searchQueryParam);
    dispatch(fetchProducts(searchQueryParam));
  }, [dispatch, searchQueryParam]);

  const baseProducts = mergeWithStationeryCatalog(items);

  let displayed = [...baseProducts];
  if (searchTerm.trim()) {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    displayed = displayed.filter((product) => (
      String(product.title || '').toLowerCase().includes(normalizedSearch)
      || String(product.category_name || '').toLowerCase().includes(normalizedSearch)
      || String(product.description || '').toLowerCase().includes(normalizedSearch)
      || String(product.brand || '').toLowerCase().includes(normalizedSearch)
    ));
  }
  if (selectedCategories.length) {
    displayed = displayed.filter((product) => selectedCategories.includes(product.category_name));
  }
  displayed = displayed.filter((product) => {
    const price = Number.parseFloat(product.price) || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });
  if (sortBy === 'price_asc') displayed.sort((a, b) => a.price - b.price);
  if (sortBy === 'price_desc') displayed.sort((a, b) => b.price - a.price);
  if (sortBy === 'newest') displayed.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const activeFilterCount = selectedCategories.length + (priceRange[1] < 5000 ? 1 : 0);

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(searchTerm.trim() ? `/products?search=${encodeURIComponent(searchTerm.trim())}` : '/products');
  };

  const toggleCategory = (category) => {
    setSelectedCategories((previous) => (
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    ));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setSortBy('');
    navigate('/products');
  };

  const handleQuickAdd = (event, product) => {
    event.preventDefault();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const handleQuickWishlist = (event, product) => {
    event.preventDefault();
    dispatch(addToWishlist(product.id));
  };

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={isMobile ? '' : 'sticky top-28'}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2 font-black text-slate-950">
            <FiFilter className="text-primary" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-black text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          {isMobile && (
            <button type="button" onClick={() => setShowMobileFilters(false)} className="text-slate-400 hover:text-slate-700" aria-label="Close filters">
              <FiX className="text-xl" />
            </button>
          )}
        </div>

        <div className="space-y-7 p-5">
          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Category</h3>
            <div className="space-y-3">
              {STATIONERY_CATEGORIES.map((category) => {
                const isActive = selectedCategories.includes(category);
                const count = baseProducts.filter((product) => product.category_name === category).length;
                return (
                  <label key={category} className="group flex cursor-pointer items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition ${
                        isActive ? 'border-primary bg-primary' : 'border-slate-300 group-hover:border-primary/50'
                      }`}>
                        {isActive && <span className="h-2 w-2 rounded-sm bg-white" />}
                      </span>
                      <input type="checkbox" checked={isActive} onChange={() => toggleCategory(category)} className="sr-only" />
                      <span className={`truncate text-sm transition ${isActive ? 'font-bold text-primary' : 'font-semibold text-slate-600 group-hover:text-slate-950'}`}>
                        {category}
                      </span>
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Price Range</h3>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange[1]}
              onChange={(event) => setPriceRange([0, Number.parseInt(event.target.value, 10)])}
              className="w-full cursor-pointer accent-primary"
            />
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-500">{formatCurrency(0)}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                Up to {formatCurrency(priceRange[1])}
              </span>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="w-full rounded-xl border border-red-200 py-3 text-sm font-black text-red-500 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-9 text-white sm:px-6 sm:py-12 lg:px-8">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1600&q=80"
            alt="Premium stationery display"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/35" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-accent sm:text-sm sm:tracking-[0.18em]">Sri Thanam Papers</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Our Collection</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:mt-4 sm:text-lg sm:leading-7">
              Discover paper, writing tools, desk supplies, and creative essentials for workspaces that feel composed.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="relative mt-6 flex max-w-2xl sm:mt-7"
          >
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for notebooks, pens, supplies..."
              className="focus-ring min-w-0 flex-1 rounded-l-xl border-0 bg-white/95 py-3 pl-11 pr-3 text-sm font-semibold text-slate-900 shadow-xl sm:rounded-l-2xl sm:py-4 sm:pl-12"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit" className="rounded-r-xl bg-accent px-4 py-3 text-sm font-black text-slate-950 shadow-xl transition hover:bg-amber-300 sm:rounded-r-2xl sm:px-7 sm:py-4">
              Search
            </button>
          </motion.form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-primary/30 md:hidden"
            >
              <FiFilter /> Filters
              {activeFilterCount > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">{activeFilterCount}</span>}
            </button>

            {!loading && (
              <motion.p key={displayed.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold text-slate-500">
                Showing <span className="font-black text-slate-950">{displayed.length}</span> products
              </motion.p>
            )}
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white sm:flex">
              <button type="button" aria-label="Grid view" onClick={() => setViewMode('grid')} className={`p-3 transition ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                <FiGrid />
              </button>
              <button type="button" aria-label="List view" onClick={() => setViewMode('list')} className={`p-3 transition ${viewMode === 'list' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                <FiList />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 sm:w-auto"
            >
              {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary transition hover:bg-primary/20"
              >
                {category} <FiX />
              </button>
            ))}
            {priceRange[1] < 5000 && (
              <button type="button" onClick={() => setPriceRange([0, 5000])} className="flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1.5 text-sm font-bold text-slate-800">
                Under {formatCurrency(priceRange[1])} <FiX />
              </button>
            )}
            <button type="button" onClick={clearAllFilters} className="px-2 text-sm font-bold text-red-500 hover:text-red-700">
              Clear all
            </button>
          </motion.div>
        )}

        <div className="flex items-start gap-8">
          <aside className="hidden w-64 flex-shrink-0 md:block">
            <FilterSidebar />
          </aside>

          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="fixed inset-y-0 left-0 z-50 w-[min(21rem,calc(100vw-1rem))] overflow-y-auto bg-white p-4 shadow-2xl md:hidden"
                >
                  <FilterSidebar isMobile />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="min-w-0 flex-grow">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[1, 2, 3, 4, 5, 6].map((item) => <SkeletonCard key={item} />)}
              </div>
            ) : displayed.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-slate-200 bg-white px-4 py-20 text-center shadow-sm">
                <FiSearch className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="mb-2 text-xl font-black text-slate-700">No products found</p>
                <p className="mb-6 text-slate-400">Try adjusting your filters or search term.</p>
                <button type="button" onClick={clearAllFilters} className="rounded-xl bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800">
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <motion.div layout className={`grid gap-3 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                <AnimatePresence mode="popLayout">
                  {displayed.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={viewMode}
                      onAddToCart={handleQuickAdd}
                      onAddToWishlist={handleQuickWishlist}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/cart" className="text-sm font-black text-primary hover:underline">Review cart -&gt;</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
