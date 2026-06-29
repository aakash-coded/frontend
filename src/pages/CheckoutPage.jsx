import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiCreditCard, FiMapPin, FiShoppingBag, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { buildUrl } from '../utils/api';
import { clearCart, fetchCart } from '../redux/slices/cartSlice';
import { placeOrder } from '../redux/slices/ordersSlice';
import ProductImage from '../components/ProductImage';
import { formatCurrency } from '../utils/formatters';

const steps = [
  { id: 1, label: 'Address', icon: FiMapPin },
  { id: 2, label: 'Payment', icon: FiCreditCard },
  { id: 3, label: 'Review', icon: FiShoppingBag },
];

const addressFields = [
  { name: 'fullName', label: 'Full Name *', placeholder: 'John Doe', colSpan: 2 },
  { name: 'addressLine1', label: 'Address Line 1 *', placeholder: '123 Main Street', colSpan: 2 },
  { name: 'addressLine2', label: 'Address Line 2', placeholder: 'Apt, floor, landmark (optional)', colSpan: 2 },
  { name: 'city', label: 'City *', placeholder: 'Coimbatore' },
  { name: 'state', label: 'State', placeholder: 'Tamil Nadu' },
  { name: 'postalCode', label: 'Postal Code *', placeholder: '641001' },
  { name: 'phone', label: 'Phone Number', placeholder: '+91 8610340098' },
];

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const { placing } = useSelector((state) => state.orders);

  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod] = useState('Cash on Delivery');
  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      setAddress((current) => ({
        ...current,
        fullName: current.fullName || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || '',
        phone: current.phone || user?.phone_number || '',
      }));
    }
  }, [dispatch, isAuthenticated, user]);

  const subtotal = items.reduce((acc, item) => acc + (Number.parseFloat(item.product.price) * item.quantity), 0);
  const discountAmount = couponData?.discount_value || 0;
  const deliveryCharge = subtotal > 500 ? 0 : 49;
  const tax = (subtotal - discountAmount) * 0.05;
  const totalNumber = subtotal - discountAmount + deliveryCharge + tax;
  const total = totalNumber.toFixed(2);

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
      toast.success('Coupon applied successfully!');
    } catch (error) {
      setCouponData(null);
      setCouponError(error.response?.data?.error || 'Invalid coupon code.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleAddressChange = (event) => {
    setAddress({ ...address, [event.target.name]: event.target.value });
  };

  const handleNext = () => {
    if (step === 1 && (!address.fullName || !address.addressLine1 || !address.city || !address.postalCode)) {
      toast.error('Please fill in all required address fields.');
      return;
    }
    setStep((current) => current + 1);
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

    const shippingAddress = `${address.fullName}, ${address.addressLine1}, ${address.addressLine2 ? `${address.addressLine2}, ` : ''}${address.city}, ${address.state} ${address.postalCode}, Phone: ${address.phone}`;
    const result = await dispatch(placeOrder({
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      coupon_code: couponData?.coupon?.code || '',
    }));

    if (!result.error) {
      dispatch(clearCart());
      setOrderPlaced(true);
    }
  };

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-green-100">
            <FiCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="mb-3 text-3xl font-black text-slate-950">Order Confirmed</h1>
          <p className="mb-2 text-slate-500">Thank you for shopping with Sri Thanam Papers.</p>
          <p className="mb-8 text-slate-500">Your order will be delivered within 3-5 business days.</p>
          <div className="mb-8 rounded-2xl bg-green-50 p-4">
            <p className="text-lg font-black text-green-800">Total Paid: {formatCurrency(total)}</p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => navigate('/profile')} className="rounded-xl bg-primary px-6 py-3 font-black text-white transition hover:bg-green-800">
              View Orders
            </button>
            <button type="button" onClick={() => navigate('/products')} className="rounded-xl border border-primary px-6 py-3 font-black text-primary transition hover:bg-primary hover:text-white">
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-12">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-accent sm:text-sm sm:tracking-[0.18em]">Secure checkout</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-4xl">Checkout</h1>
        </div>

        <div className="grid gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0">
            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:mb-8 sm:p-6">
              <div className="grid grid-cols-3 items-start gap-2 sm:flex sm:items-center sm:justify-between">
                {steps.map((item, index) => (
                  <div key={item.id} className="flex min-w-0 flex-1 items-center justify-center sm:justify-start">
                    <div className="flex min-w-0 flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black transition sm:h-11 sm:w-11 ${
                        step >= item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {step > item.id ? <FiCheckCircle /> : <item.icon />}
                      </div>
                      <span className={`mt-2 max-w-full truncate text-[11px] font-black sm:text-xs ${step >= item.id ? 'text-primary' : 'text-slate-400'}`}>{item.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`mx-4 hidden h-1 flex-1 rounded-full transition sm:block ${step > item.id ? 'bg-primary' : 'bg-slate-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 26 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -26 }}
                  transition={{ duration: 0.22 }}
                >
                  {step === 1 && (
                    <section>
                      <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-950 sm:mb-6 sm:text-xl">
                        <FiMapPin className="text-primary" /> Shipping Address
                      </h2>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {addressFields.map((field) => (
                          <div key={field.name} className={field.colSpan === 2 ? 'md:col-span-2' : ''}>
                            <label className="mb-1 block text-sm font-black text-slate-700">{field.label}</label>
                            <input
                              type="text"
                              name={field.name}
                              value={address[field.name]}
                              onChange={handleAddressChange}
                              placeholder={field.placeholder}
                              className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button type="button" onClick={handleNext} className="w-full rounded-xl bg-primary px-8 py-3.5 font-black text-white transition hover:bg-green-800 sm:w-auto">
                          Continue to Payment -&gt;
                        </button>
                      </div>
                    </section>
                  )}

                  {step === 2 && (
                    <section>
                      <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-950 sm:mb-6 sm:text-xl">
                        <FiCreditCard className="text-primary" /> Payment Method
                      </h2>
                      <div className="rounded-2xl border border-primary bg-primary/5 p-4 sm:p-5">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                            <FiCheckCircle />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-950">Cash on Delivery</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              Customers pay when the order arrives. No online payment step is required.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <button type="button" onClick={() => setStep(1)} className="px-6 py-3 font-black text-slate-500 hover:text-slate-700">
                          &lt;- Back
                        </button>
                        <button type="button" onClick={handleNext} className="w-full rounded-xl bg-primary px-8 py-3.5 font-black text-white transition hover:bg-green-800 sm:w-auto">
                          Review Order -&gt;
                        </button>
                      </div>
                    </section>
                  )}

                  {step === 3 && (
                    <section>
                      <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-950 sm:mb-6 sm:text-xl">
                        <FiShoppingBag className="text-primary" /> Order Review
                      </h2>
                      <div className="mb-6 space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-3 rounded-xl bg-slate-50 p-3 sm:flex sm:items-center sm:gap-4">
                            <ProductImage product={item.product} containerClassName="h-12 w-12 rounded-xl" />
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 text-sm font-black text-slate-800">{item.product.title}</p>
                              <p className="text-xs font-semibold text-slate-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="col-start-2 text-sm font-black text-slate-950 sm:whitespace-nowrap sm:text-base">
                              {formatCurrency(Number.parseFloat(item.product.price) * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Totals subtotal={subtotal} discountAmount={discountAmount} deliveryCharge={deliveryCharge} tax={tax} total={totalNumber} />

                      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                        <p><strong>Delivering to:</strong> {address.fullName}, {address.city}</p>
                        <p><strong>Payment:</strong> {paymentMethod}</p>
                      </div>
                      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <button type="button" onClick={() => setStep(2)} className="px-6 py-3 font-black text-slate-500 hover:text-slate-700">
                          &lt;- Back
                        </button>
                        <button
                          type="button"
                          onClick={handlePlaceOrder}
                          disabled={placing}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-black text-slate-950 shadow-lg shadow-accent/20 transition hover:bg-amber-300 disabled:opacity-60 sm:w-auto"
                        >
                          {placing ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" /> Placing Order...
                            </>
                          ) : (
                            'Place Order'
                          )}
                        </button>
                      </div>
                    </section>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-4 text-lg font-black text-slate-950">Order Summary</h3>
              <div className="max-h-48 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-sm">
                    <span className="min-w-0 break-words text-slate-600">{item.product.title} x {item.quantity}</span>
                    <span className="font-black text-slate-900">{formatCurrency(Number.parseFloat(item.product.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-lg font-black text-primary">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                {deliveryCharge === 0 && <p className="mt-1 text-xs font-black text-green-600">Free delivery on this order.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-950">
                <FiTag className="text-primary" /> Apply Coupon
              </h3>
              <div className="flex flex-col gap-2 min-[380px]:flex-row">
                <input
                  type="text"
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="focus-ring min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white transition hover:bg-green-800 disabled:bg-slate-300"
                >
                  {couponLoading ? 'Checking...' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="mt-2 text-xs font-bold text-red-500">{couponError}</p>}
              {couponData?.coupon && (
                <div className="mt-3 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
                  Applied <span className="font-black">{couponData.coupon.code}</span> for {formatCurrency(couponData.discount_value)} off.
                </div>
              )}
              <p className="mt-2 text-xs font-semibold text-slate-400">Try: SAVE10, WELCOME20, SRITHANAM</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Totals({ subtotal, discountAmount, deliveryCharge, tax, total }) {
  return (
    <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-slate-600">
        <span>Subtotal</span>
        <span className="font-bold">{formatCurrency(subtotal)}</span>
      </div>
      {discountAmount > 0 && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-green-600">
          <span>Discount</span>
          <span className="font-bold">-{formatCurrency(discountAmount)}</span>
        </div>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-slate-600">
        <span>Delivery</span>
        <span className={deliveryCharge === 0 ? 'font-black text-green-600' : 'font-bold'}>{deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-slate-600">
        <span>GST (5%)</span>
        <span className="font-bold">{formatCurrency(tax)}</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-t border-slate-200 pt-3 text-lg font-black text-slate-950">
        <span>Total</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

export default CheckoutPage;
