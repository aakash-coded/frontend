import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiShoppingBag, FiCheckCircle, FiTag } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { buildUrl } from '../utils/api';
import { placeOrder } from '../redux/slices/ordersSlice';
import { clearCart, fetchCart } from '../redux/slices/cartSlice';

const STEPS = [
  { id: 1, label: 'Address', icon: FiMapPin },
  { id: 2, label: 'Payment', icon: FiCreditCard },
  { id: 3, label: 'Review', icon: FiShoppingBag },
];

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { placing } = useSelector((state) => state.orders);
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  });

  // Ensure cart is loaded from server for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);
  const discountAmount = couponData?.discount_value || 0;
  const deliveryCharge = subtotal > 500 ? 0 : 49;
  const tax = ((subtotal - discountAmount) * 0.05);
  const total = (subtotal - discountAmount + deliveryCharge + tax).toFixed(2);

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponError('Enter a coupon code to apply.');
      setCouponData(null);
      return;
    }

    if (!token) {
      setCouponError('Please sign in to apply a coupon.');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const response = await axios.get(buildUrl('/api/orders/validate_coupon/'), {
        params: { code: coupon.trim().toUpperCase() },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCouponData(response.data);
      setCouponError('');
      toast.success('Coupon applied successfully!');
    } catch (error) {
      setCouponData(null);
      const message = error.response?.data?.error || 'Invalid coupon code.';
      setCouponError(message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!address.fullName || !address.addressLine1 || !address.city || !address.postalCode) {
        toast.error('Please fill in all required address fields.');
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!items.length) {
      toast.error('Your cart is empty. Add items before placing an order.');
      return;
    }
    const shippingAddress = `${address.fullName}, ${address.addressLine1}, ${address.addressLine2 ? address.addressLine2 + ', ' : ''}${address.city}, ${address.state} ${address.postalCode}, Phone: ${address.phone}`;
    const result = await dispatch(placeOrder({
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      coupon_code: couponData?.coupon?.code || '',
    }));
    if (!result.error) {
      dispatch(clearCart());
      
      const orderId = result.payload?.id;
      
      if (paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') {
        try {
          const sessionRes = await axios.post(buildUrl('/api/payments/create-checkout-session/'), 
            { order_id: orderId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (sessionRes.data.checkout_url) {
            window.location.href = sessionRes.data.checkout_url;
            return;
          }
          toast.error(sessionRes.data.error || 'Failed to redirect to payment gateway.');
        } catch (error) {
          const message = error.response?.data?.error || error.message || 'Failed to redirect to payment gateway.';
          toast.error(message);
        }
      }
      
      setOrderPlaced(true);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheckCircle className="text-green-500 text-5xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed! 🎉</h1>
          <p className="text-gray-500 mb-2">Thank you for shopping with Sri Thanam Papers.</p>
          <p className="text-gray-500 mb-8">Your order will be delivered within 3–5 business days.</p>
          <div className="bg-green-50 rounded-xl p-4 mb-8">
            <p className="text-green-800 font-semibold text-lg">Total Paid: ₹{total}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/profile')}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors"
            >
              View Orders
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/products')}
              className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Continue Shopping
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Panel */}
          <div className="flex-1">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {STEPS.map((s, idx) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100 text-gray-400'}`}>
                      {step > s.id ? <FiCheckCircle className="text-lg" /> : <s.icon />}
                    </div>
                    <span className={`text-xs mt-1 font-medium ${step >= s.id ? 'text-primary' : 'text-gray-400'}`}>{s.label}</span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-3 rounded transition-all ${step > s.id ? 'bg-primary' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Step 1: Address */}
                  {step === 1 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FiMapPin className="text-primary" /> Shipping Address
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: 'fullName', label: 'Full Name *', placeholder: 'John Doe', colSpan: 2 },
                          { name: 'addressLine1', label: 'Address Line 1 *', placeholder: '123 Main Street', colSpan: 2 },
                          { name: 'addressLine2', label: 'Address Line 2', placeholder: 'Apt, Floor (optional)', colSpan: 2 },
                          { name: 'city', label: 'City *', placeholder: 'Chennai' },
                          { name: 'state', label: 'State', placeholder: 'Tamil Nadu' },
                          { name: 'postalCode', label: 'Postal Code *', placeholder: '600001' },
                          { name: 'phone', label: 'Phone Number', placeholder: '+91 9876543210' },
                        ].map((field) => (
                          <div key={field.name} className={field.colSpan === 2 ? 'md:col-span-2' : ''}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            <input
                              type="text"
                              name={field.name}
                              value={address[field.name]}
                              onChange={handleAddressChange}
                              placeholder={field.placeholder}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none bg-gray-50 transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 flex justify-end">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNext}
                          className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-800 transition-colors"
                        >
                          Continue to Payment →
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Payment */}
                  {step === 2 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FiCreditCard className="text-primary" /> Payment Method
                      </h2>
                      <div className="space-y-4">
                        {['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'].map((method) => (
                          <label
                            key={method}
                            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={method}
                              checked={paymentMethod === method}
                              onChange={() => setPaymentMethod(method)}
                              className="h-5 w-5 text-primary"
                            />
                            <div className="flex-1">
                              <span className="font-semibold text-gray-800">{method}</span>
                              {method === 'Cash on Delivery' && (
                                <p className="text-sm text-gray-500 mt-0.5">Pay when your order arrives</p>
                              )}
                              {method === 'UPI' && (
                                <p className="text-sm text-gray-500 mt-0.5">Google Pay, PhonePe, Paytm, etc.</p>
                              )}
                            </div>
                            {paymentMethod === method && (
                              <FiCheckCircle className="text-primary text-xl" />
                            )}
                          </label>
                        ))}
                      </div>
                      <div className="mt-8 flex justify-between">
                        <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700 px-6 py-3 font-medium">
                          ← Back
                        </button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNext}
                          className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-800 transition-colors"
                        >
                          Review Order →
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review */}
                  {step === 3 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FiShoppingBag className="text-primary" /> Order Review
                      </h2>
                      <div className="space-y-3 mb-6">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                              {item.product.title?.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-800">{item.product.title}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-gray-900">₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-₹{discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery</span>
                          <span>{deliveryCharge === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${deliveryCharge}`}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>GST (5%)</span>
                          <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                          <span>Total</span>
                          <span className="text-primary">₹{total}</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                        <strong>Delivering to:</strong> {address.fullName}, {address.city}
                        <br />
                        <strong>Payment:</strong> {paymentMethod}
                      </div>
                      <div className="mt-8 flex justify-between">
                        <button type="button" onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-700 px-6 py-3 font-medium">
                          ← Back
                        </button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePlaceOrder}
                          disabled={placing}
                          className="bg-accent text-white px-8 py-3.5 rounded-xl font-bold hover:bg-yellow-500 transition-colors shadow-lg disabled:opacity-60 flex items-center gap-2"
                        >
                          {placing ? (
                            <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Placing Order...</>
                          ) : (
                            '🎉 Place Order'
                          )}
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[180px]">{item.product.title} × {item.quantity}</span>
                    <span className="font-semibold">₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg text-primary">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                {deliveryCharge === 0 && (
                  <p className="text-green-600 text-xs mt-1 font-medium">✓ Free delivery on this order!</p>
                )}
              </div>
            </div>

            {/* Coupon Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiTag className="text-primary" /> Apply Coupon
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="bg-primary disabled:bg-gray-300 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors"
                >
                  {couponLoading ? 'Checking…' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
              {couponData?.coupon && (
                <div className="mt-3 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                  ✓ Applied <span className="font-semibold">{couponData.coupon.code}</span> for ₹{couponData.discount_value.toFixed(2)} off.
                </div>
              )}
              <p className="text-gray-400 text-xs mt-2">Try: SAVE10, WELCOME20, SRITHANAM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
