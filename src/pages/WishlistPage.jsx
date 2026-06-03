import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import ProductImage from '../components/ProductImage';
import { formatCurrency } from '../utils/formatters';

function WishlistPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500">
          <FiHeart className="text-4xl" />
        </div>
        <h2 className="mb-3 text-2xl font-black text-slate-800">Login to view your wishlist</h2>
        <p className="mb-6 max-w-md text-slate-500">Save products, compare favorites, and move them into your cart when you are ready.</p>
        <Link to="/login" className="rounded-xl bg-primary px-8 py-3 font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Saved picks</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              My Wishlist
              {items.length > 0 && <span className="ml-3 text-base font-bold text-slate-500">({items.length})</span>}
            </h1>
          </div>
          <Link to="/products" className="text-sm font-black text-primary hover:underline">Discover Products -&gt;</Link>
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-300">
              <FiHeart className="text-5xl" />
            </div>
            <h2 className="mb-3 text-2xl font-black text-slate-800">Your wishlist is empty</h2>
            <p className="mb-8 text-slate-500">Save paper goods, writing tools, and desk essentials for later.</p>
            <Link to="/products" className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800">
              Discover Products
            </Link>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"
                >
                  <Link to={`/product/${item.product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
                    <ProductImage product={item.product} containerClassName="h-full" className="transition-transform duration-700 group-hover:scale-110" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                      {item.product.category_name || 'Stationery'}
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <Link to={`/product/${item.product.id}`} className="line-clamp-2 text-base font-black leading-snug text-slate-950 transition hover:text-primary">
                      {item.product.title}
                    </Link>
                    <p className="mt-3 text-xl font-black text-primary">{formatCurrency(item.product.price)}</p>
                    <div className="mt-auto flex items-center gap-2 pt-5">
                      <button
                        type="button"
                        onClick={() => dispatch(addToCart({ productId: item.product.id, quantity: 1 }))}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800"
                      >
                        <FiShoppingCart /> Add
                      </button>
                      <button
                        type="button"
                        aria-label="Remove from wishlist"
                        onClick={() => dispatch(removeFromWishlist(item.id))}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
