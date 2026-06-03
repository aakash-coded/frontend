import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiChevronDown,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSearch,
  FiShoppingCart,
  FiSun,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { STATIONERY_CATEGORIES } from '../data/stationeryCatalog';
import NotificationBell from './NotificationBell';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
];

const searchSuggestions = [
  'notebook',
  'planner',
  'fountain pen',
  'sticky notes',
  'art supplies',
  'file folders',
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  const cartItems = useSelector((state) => state.cart?.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setMobileOpen(false);
  };

  const goToCategory = (category) => {
    navigate(`/products?search=${encodeURIComponent(category)}`);
    setCategoryOpen(false);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
    navigate('/login');
  };

  const navClass = ({ isActive }) => (
    `rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-slate-600 hover:bg-slate-100 hover:text-primary'
    }`
  );

  const Badge = ({ count, tone = 'accent' }) => (
    count > 0 ? (
      <span className={`absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black ${
        tone === 'danger' ? 'bg-red-500 text-white' : 'bg-accent text-slate-950'
      }`}>
        {count}
      </span>
    ) : null
  );

  return (
    <>
      <motion.nav
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="fixed left-0 top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
          <Link to="/" className="flex min-w-0 flex-shrink-0 items-center" aria-label="Sri Thanam Papers home">
            <span className="min-w-0 border-l-4 border-accent pl-3">
              <span className="block truncate font-serif text-xl font-black leading-6 tracking-normal text-slate-950 sm:text-2xl">
                Sri Thanam Papers
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-primary">
                Premium Stationery
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="relative ml-auto hidden max-w-xl flex-1 lg:block">
            <form onSubmit={handleSearch} className="relative">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search notebooks, pens, paper..."
                className="focus-ring w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 transition focus:border-primary/30 focus:bg-white"
              />
            </form>

            <AnimatePresence>
              {showSuggestions && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 top-14 z-20 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                >
                  {searchSuggestions
                    .filter((term) => term.includes(searchQuery.toLowerCase()))
                    .map((term) => (
                      <button
                        key={term}
                        type="button"
                        onMouseDown={() => {
                          navigate(`/products?search=${encodeURIComponent(term)}`);
                          setSearchQuery('');
                        }}
                        className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-primary"
                      >
                        {term}
                      </button>
                    ))}
                  <p className="border-t border-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Popular searches
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <div className="relative">
              <button
                type="button"
                aria-expanded={categoryOpen}
                aria-controls="category-menu"
                onClick={() => setCategoryOpen((open) => !open)}
                className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-primary/30 hover:text-primary"
              >
                Categories <FiChevronDown />
              </button>

              <AnimatePresence>
                {categoryOpen && (
                  <motion.div
                    id="category-menu"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                  >
                    {STATIONERY_CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => goToCategory(category)}
                        className="block w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-primary/5 hover:text-primary"
                      >
                        {category}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setDarkMode((value) => !value)}
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-primary/30 hover:text-primary"
            >
              {darkMode ? <FiSun className="text-amber-500" /> : <FiMoon />}
            </button>

            <Link to="/wishlist" aria-label="Go to wishlist" className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-red-200 hover:text-red-500">
              <FiHeart />
              <Badge count={wishlistItems.length} tone="danger" />
            </Link>

            <Link to="/cart" aria-label="Go to cart" className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-primary/30 hover:text-primary">
              <FiShoppingCart />
              <Badge count={cartItems.length} />
            </Link>

            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Link to="/profile" aria-label="Go to profile" className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-primary/30 hover:text-primary">
                  <FiUser />
                </Link>
                <button
                  type="button"
                  aria-label="Logout"
                  onClick={handleLogout}
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:text-red-500"
                >
                  <FiLogOut />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-primary">
                  Login
                </Link>
                <Link to="/register" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close mobile menu' : 'Open mobile menu'}
            onClick={() => setMobileOpen((open) => !open)}
            className="focus-ring ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,calc(100vw-1rem))] flex-col overflow-y-auto bg-white px-5 pb-8 pt-20 shadow-2xl md:hidden"
            >
              <form onSubmit={handleSearch} className="relative mb-5">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products..."
                  className="focus-ring w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900"
                />
              </form>

              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={navClass}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <NavLink to="/cart" onClick={() => setMobileOpen(false)} className={navClass}>
                  Cart {cartItems.length > 0 && <span className="ml-2 text-accent">({cartItems.length})</span>}
                </NavLink>
                <NavLink to="/profile" onClick={() => setMobileOpen(false)} className={navClass}>
                  Profile
                </NavLink>
              </nav>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Categories</p>
                <div className="grid grid-cols-1 gap-2">
                  {STATIONERY_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => goToCategory(category)}
                      className="rounded-xl bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-primary/5 hover:text-primary"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setDarkMode((value) => !value)}
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700"
                >
                  {darkMode ? <FiSun className="text-amber-500" /> : <FiMoon />}
                  {darkMode ? 'Light mode' : 'Dark mode'}
                </button>

                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-bold text-red-600"
                  >
                    <FiLogOut /> Logout
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-xl border border-primary py-3 text-center text-sm font-bold text-primary">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-xl bg-primary py-3 text-center text-sm font-black text-white">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
