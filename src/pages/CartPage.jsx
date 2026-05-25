import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, updateCartItem } from '../redux/slices/cartSlice';
import { Link } from 'react-router-dom';
import { FiTrash2, FiArrowRight, FiShoppingBag, FiMinus, FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function CartPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.product?.price || 0) * item.quantity), 0);
  const deliveryCharge = subtotal > 500 ? 0 : 49;
  const tax = subtotal * 0.05;
  const total = (subtotal + deliveryCharge + tax).toFixed(2);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <FiShoppingBag className="text-6xl text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Please Login</h2>
        <p className="text-gray-500 mb-6">Login to view and manage your cart.</p>
        <Link to="/login" className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition-colors">
          Login Now
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart
            {items.length > 0 && <span className="ml-3 text-lg font-normal text-gray-500">({items.length} items)</span>}
          </h1>
          <Link to="/products" className="text-primary font-semibold hover:underline text-sm">← Continue Shopping</Link>
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <FiShoppingBag className="text-7xl text-gray-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some amazing stationery products to get started!</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-green-800 transition-all shadow-lg">
              <FiShoppingBag /> Shop Now
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl font-bold text-primary">
                      {item.product?.title?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product?.id}`} className="font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1">
                        {item.product?.title}
                      </Link>
                      <p className="text-primary font-bold text-lg mt-1">₹{parseFloat(item.product?.price || 0).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => dispatch(updateCartItem({ itemId: item.id, quantity: item.quantity - 1 }))}
                        disabled={item.quantity <= 1}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-40"
                      >
                        <FiMinus className="text-sm" />
                      </button>
                      <span className="px-4 py-2 font-bold text-gray-900 min-w-[40px] text-center">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => dispatch(updateCartItem({ itemId: item.id, quantity: item.quantity + 1 }))}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <FiPlus className="text-sm" />
                      </button>
                    </div>
                    <div className="text-right min-w-[90px]">
                      <p className="font-bold text-gray-900">₹{(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                      <button
                        type="button"
                        aria-label="Remove item from cart"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-400 hover:text-red-600 transition-colors mt-1"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="w-full lg:w-80">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{deliveryCharge === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${deliveryCharge}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600"><span>GST (5%)</span><span>₹{tax.toFixed(2)}</span></div>
                  {deliveryCharge > 0 && (
                    <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      Add ₹{(500 - subtotal).toFixed(2)} more for FREE delivery!
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-100 mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span><span className="text-primary">₹{total}</span>
                  </div>
                </div>
                <Link to="/checkout"
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg">
                  Proceed to Checkout <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
