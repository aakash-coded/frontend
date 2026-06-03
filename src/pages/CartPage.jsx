import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiTruck } from 'react-icons/fi';
import { fetchCart, removeFromCart, updateCartItem } from '../redux/slices/cartSlice';
import ProductImage from '../components/ProductImage';
import { formatCurrency } from '../utils/formatters';

function CartPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const subtotal = items.reduce((acc, item) => acc + (Number.parseFloat(item.product?.price || 0) * item.quantity), 0);
  const deliveryCharge = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryCharge + tax;
  const freeDeliveryProgress = Math.min((subtotal / 500) * 100, 100);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <FiShoppingBag className="text-4xl" />
        </div>
        <h2 className="mb-3 text-2xl font-black text-slate-800">Please login</h2>
        <p className="mb-6 max-w-md text-slate-500">Login to view your saved cart and continue checkout securely.</p>
        <Link to="/login" className="rounded-xl bg-primary px-8 py-3 font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800">
          Login Now
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Checkout prep</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              Shopping Cart
              {items.length > 0 && <span className="ml-3 text-base font-bold text-slate-500">({items.length} items)</span>}
            </h1>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-black text-primary hover:underline">
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm sm:px-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-300">
              <FiShoppingBag className="text-5xl" />
            </div>
            <h2 className="mb-3 text-2xl font-black text-slate-800">Your cart is empty</h2>
            <p className="mb-8 text-slate-500">Add premium stationery products to prepare your order.</p>
            <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800">
              <FiShoppingBag /> Shop Now
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => {
                  const unitPrice = Number.parseFloat(item.product?.price || 0);
                  return (
                    <motion.article
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-primary/20 hover:shadow-lg sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 flex-1 gap-4">
                          <ProductImage product={item.product} containerClassName="h-24 w-24 flex-shrink-0 rounded-2xl" />
                          <div className="min-w-0 flex-1">
                            <Link to={`/product/${item.product?.id}`} className="line-clamp-2 font-black leading-snug text-slate-950 transition hover:text-primary">
                              {item.product?.title}
                            </Link>
                            <p className="mt-2 text-sm font-semibold text-slate-500">
                              {item.product?.category_name || 'Stationery'}
                            </p>
                            <p className="mt-2 text-lg font-black text-primary">{formatCurrency(unitPrice)}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-start">
                          <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => dispatch(updateCartItem({ itemId: item.id, quantity: item.quantity - 1 }))}
                              disabled={item.quantity <= 1}
                              className="p-3 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <FiMinus />
                            </button>
                            <span className="min-w-12 px-3 text-center font-black text-slate-950">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => dispatch(updateCartItem({ itemId: item.id, quantity: item.quantity + 1 }))}
                              className="p-3 text-slate-600 transition hover:bg-slate-200"
                            >
                              <FiPlus />
                            </button>
                          </div>

                          <div className="min-w-24 text-right">
                            <p className="font-black text-slate-950">{formatCurrency(unitPrice * item.quantity)}</p>
                            <button
                              type="button"
                              aria-label="Remove item from cart"
                              onClick={() => dispatch(removeFromCart(item.id))}
                              className="mt-2 inline-flex items-center justify-center rounded-lg p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>

            <aside>
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">Order Summary</h2>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-primary">
                    <FiTruck /> Free delivery over {formatCurrency(500)}
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${freeDeliveryProgress}%` }} />
                  </div>
                  {deliveryCharge > 0 ? (
                    <p className="mt-3 text-xs font-semibold text-slate-500">
                      Add {formatCurrency(500 - subtotal)} more for free delivery.
                    </p>
                  ) : (
                    <p className="mt-3 text-xs font-black text-green-700">Free delivery unlocked.</p>
                  )}
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? 'font-black text-green-700' : 'font-bold text-slate-900'}>
                      {deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (5%)</span>
                    <span className="font-bold text-slate-900">{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="flex justify-between text-lg font-black text-slate-950">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800">
                  Proceed to Checkout <FiArrowRight />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
