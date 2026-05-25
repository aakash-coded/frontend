import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiFilter, FiSearch, FiX, FiGrid, FiList, FiHeart, FiEye } from 'react-icons/fi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SkeletonCard } from '../components/Skeletons';
import { getProductImageUrl } from '../utils/productImages';
import { addToWishlist } from '../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';

const CATEGORIES = ['Notebooks', 'Pens & Pencils', 'Office Supplies'];
const placeholderProducts = Array.from({ length: 30 }, (_, i) => ({
  id: `placeholder-${i + 1}`,
  title: `Stationery Essential ${i + 1}`,
  price: (199 + i * 10).toFixed(0),
  description: 'A versatile stationery essential designed for everyday use.',
  category_name: CATEGORIES[i % CATEGORIES.length],
  image: getProductImageUrl({
    title: `Stationery Essential ${i + 1}`,
    category_name: CATEGORIES[i % CATEGORIES.length],
  }),
}));
const SORT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
];

function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, loading } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchTerm(q);
    dispatch(fetchProducts(q));
  }, [searchParams.get('search')]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchTerm.trim() ? `/products?search=${encodeURIComponent(searchTerm.trim())}` : '/products');
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
    toast.success(`${product.title} added to cart!`, { icon: '🛒' });
  };

  const handleQuickWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToWishlist(product.id));
    toast.success(`Added to wishlist!`, { icon: '❤️' });
  };

  const noFiltersApplied = !searchTerm.trim() && selectedCategories.length === 0;
  const baseProducts = noFiltersApplied
    ? items.length >= 30
      ? items
      : [...items, ...placeholderProducts].slice(0, 30)
    : items;

  let displayed = [...baseProducts];
  if (selectedCategories.length) {
    displayed = displayed.filter(p => selectedCategories.includes(p.category_name));
  }
  displayed = displayed.filter(p => {
    const price = parseFloat(p.price) || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });
  if (sortBy === 'price_asc') displayed.sort((a, b) => a.price - b.price);
  if (sortBy === 'price_desc') displayed.sort((a, b) => b.price - a.price);
  if (sortBy === 'newest') displayed.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const activeFilterCount = selectedCategories.length + (priceRange[1] < 5000 ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setSortBy('');
    navigate('/products');
  };

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={isMobile ? '' : 'sticky top-24'}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <FiFilter className="text-primary" /> Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          {isMobile && (
            <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-gray-600">
              <FiX className="text-xl" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Category</h3>
            <div className="space-y-2.5">
              {CATEGORIES.map(cat => {
                const isActive = selectedCategories.includes(cat);
                const count = baseProducts.filter(p => p.category_name === cat).length;
                return (
                  <label key={cat} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isActive ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary/50'}`}>
                        {isActive && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input type="checkbox" checked={isActive} onChange={() => toggleCategory(cat)} className="sr-only" />
                      <span className={`text-sm transition-colors ${isActive ? 'text-primary font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Price Range</h3>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">₹0</span>
                <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full text-xs">Up to ₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Clear */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="w-full py-2.5 text-sm text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 rounded-xl font-medium transition-all duration-200"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-green-800 to-green-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">Our Collection</h1>
            <p className="text-green-200 text-lg max-w-xl mb-6">Discover premium stationery crafted for creativity and productivity.</p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex relative max-w-xl"
          >
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search for notebooks, pens, supplies..."
              className="w-full pl-12 pr-4 py-4 rounded-l-2xl border-0 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white/95 text-gray-900 text-sm shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-accent text-gray-900 px-6 py-4 rounded-r-2xl hover:bg-yellow-400 transition-colors text-sm font-bold shadow-xl">
              Search
            </button>
          </motion.form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 hover:border-primary/50 transition"
            >
              <FiFilter /> Filters {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">{activeFilterCount}</span>}
            </button>

            {!loading && (
              <motion.p key={displayed.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{displayed.length}</span> products
              </motion.p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode */}
            <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                <FiGrid />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                <FiList />
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium text-gray-700"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition"
              >
                {cat} <FiX className="text-xs" />
              </button>
            ))}
            {priceRange[1] < 5000 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full">
                Under ₹{priceRange[1].toLocaleString()}
                <button onClick={() => setPriceRange([0, 5000])}><FiX className="text-xs" /></button>
              </span>
            )}
            <button onClick={clearAllFilters} className="text-sm text-red-500 hover:text-red-700 font-medium px-2">
              Clear all
            </button>
          </motion.div>
        )}

        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile Filters Modal */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                />
                <motion.div
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="fixed inset-y-0 left-0 w-80 bg-white z-50 overflow-y-auto md:hidden shadow-2xl"
                >
                  <div className="p-4">
                    <FilterSidebar isMobile />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-grow min-w-0">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : displayed.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-xl font-semibold text-gray-700 mb-2">No products found</p>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search term</p>
                <button type="button" onClick={clearAllFilters} className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition text-sm shadow-lg shadow-primary/20">
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <motion.div layout className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                <AnimatePresence mode="popLayout">
                  {displayed.map((product) => (
                    viewMode === 'grid' ? (
                      /* Grid Card */
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        key={product.id}
                        className="bg-white overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                      >
                        <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
                          <Link to={`/product/${product.id}`} className="block h-full">
                            <img
                              src={getProductImageUrl(product)}
                              alt={product.title}
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=900&q=80'; }}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </Link>
                          {/* Hover Action Buttons */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                            <button
                              onClick={(e) => handleQuickAdd(e, product)}
                              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-gray-600 hover:bg-primary hover:text-white transition-colors"
                              aria-label="Quick Add to Cart"
                            >
                              <FiShoppingCart className="text-sm" />
                            </button>
                            <button
                              onClick={(e) => handleQuickWishlist(e, product)}
                              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
                              aria-label="Add to Wishlist"
                            >
                              <FiHeart className="text-sm" />
                            </button>
                            <Link
                              to={`/product/${product.id}`}
                              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-gray-600 hover:bg-accent hover:text-white transition-colors"
                              aria-label="Quick View"
                            >
                              <FiEye className="text-sm" />
                            </Link>
                          </div>
                          {/* Category Badge */}
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-3 py-1 rounded-full shadow-sm">
                              {product.category_name}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <Link to={`/product/${product.id}`} className="font-semibold text-gray-900 text-base leading-snug mb-2 hover:text-primary transition-colors line-clamp-2">
                            {product.title}
                          </Link>
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{product.description || 'A premium stationery piece designed for modern workspaces.'}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-xl font-bold text-primary">₹{product.price}</span>
                            <Link
                              to={`/product/${product.id}`}
                              className="text-sm font-semibold text-primary hover:text-green-800 transition-colors"
                            >
                              View →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      /* List Card */
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        key={product.id}
                        className="bg-white overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-row"
                      >
                        <Link to={`/product/${product.id}`} className="block w-48 flex-shrink-0 overflow-hidden">
                          <img
                            src={getProductImageUrl(product)}
                            alt={product.title}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=900&q=80'; }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                        <div className="p-5 flex flex-col flex-grow justify-center">
                          <span className="text-xs uppercase font-semibold tracking-wider text-accent mb-1">{product.category_name}</span>
                          <Link to={`/product/${product.id}`} className="font-semibold text-gray-900 text-lg mb-2 hover:text-primary transition-colors">
                            {product.title}
                          </Link>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description || 'A premium stationery piece designed for modern workspaces.'}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-primary">₹{product.price}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => handleQuickAdd(e, product)}
                                className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-800 transition flex items-center gap-1.5"
                              >
                                <FiShoppingCart className="text-xs" /> Add to Cart
                              </button>
                              <Link to={`/product/${product.id}`} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition">
                                Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
