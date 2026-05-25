import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Wishlist', to: '/wishlist' },
];

const CATEGORIES = [
  'Notebooks',
  'Pens & Pencils',
  'Office Supplies',
  'Art Materials',
  'School Supplies',
  'Eco-Friendly',
  'Diaries',
  'Craft Items',
];

const SEARCH_SUGGESTIONS = [
  'notebook',
  'planner',
  'fountain pen',
  'sticky notes',
  'art supplies',
  'file folders',
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const cartItems = useSelector(state => state.cart?.items || []);
  const wishlistItems = useSelector(state => state.wishlist?.items || []);
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed w-full top-0 left-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 text-2xl font-extrabold tracking-tight text-primary">
            Sri Thanam<span className="text-accent">Papers</span>
          </Link>

          {/* Search — desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                placeholder="Search notebooks, pens, supplies…"
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow text-sm"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
            {showSuggestions && searchQuery.trim().length > 0 && (
              <div className="absolute top-14 left-0 w-full bg-white rounded-3xl border border-gray-200 shadow-xl z-20 overflow-hidden">
                {SEARCH_SUGGESTIONS.filter((term) => term.includes(searchQuery.toLowerCase())).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onMouseDown={() => { navigate(`/products?search=${encodeURIComponent(term)}`); setSearchQuery(''); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    {term}
                  </button>
                ))}
                <div className="px-4 py-3 border-t border-gray-100 text-xs uppercase tracking-[0.2em] text-gray-400">Popular searches</div>
              </div>
            )}
          </div>

          {/* Desktop nav icons */}
          <div className="hidden md:flex items-center gap-5 relative">
            <div className="relative">
              <button
                type="button"
                aria-expanded={categoryOpen}
                aria-controls="category-menu"
                onClick={() => setCategoryOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                Categories <FiChevronDown className="w-4 h-4" />
              </button>
              {categoryOpen && (
                <div id="category-menu" className="absolute mt-2 w-60 bg-white rounded-3xl border border-gray-200 shadow-xl z-20 overflow-hidden">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => { navigate(`/products?search=${encodeURIComponent(category)}`); setCategoryOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-600 hover:text-primary transition-colors focus:outline-none"
              title="Toggle theme"
            >
              {darkMode ? <FiSun className="w-5 h-5 text-amber-500 animate-pulse" /> : <FiMoon className="w-5 h-5" />}
            </button>
<Link to="/wishlist" aria-label="Go to wishlist" className="relative text-gray-600 hover:text-primary transition-colors">
                <FiHeart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" aria-label="Go to cart" className="relative text-gray-600 hover:text-primary transition-colors">
              <FiShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="text-gray-600 hover:text-primary transition-colors">
                  <FiUser className="w-5 h-5" />
                </Link>
                <button type="button" aria-label="Logout" onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="text-sm font-bold bg-primary text-white px-4 py-2 rounded-full hover:bg-green-800 transition-colors shadow-sm">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close mobile menu' : 'Open mobile menu'}
            className="md:hidden text-gray-700 hover:text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 right-0 z-40 w-72 bg-white shadow-2xl flex flex-col pt-20 pb-8 px-6"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-gray-50 text-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>

            <nav className="flex flex-col gap-1 flex-grow">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-colors"
              >
                Cart {cartItems.length > 0 && <span className="ml-auto bg-accent text-white text-xs font-bold rounded-full px-2 py-0.5">{cartItems.length}</span>}
              </Link>
              <button
                type="button"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-colors text-left"
              >
                {darkMode ? (
                  <>
                    <FiSun className="text-amber-500" /> Light Mode
                  </>
                ) : (
                  <>
                    <FiMoon /> Dark Mode
                  </>
                )}
              </button>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 font-medium">
                    <FiUser /> My Profile
                  </Link>
                  <button type="button" aria-label="Logout" onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium">
                    <FiLogOut /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center py-3 rounded-full font-semibold border border-primary text-primary hover:bg-primary/5 transition-colors">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center py-3 rounded-full font-bold bg-primary text-white hover:bg-green-800 transition-colors">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
