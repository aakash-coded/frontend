import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiSettings, FiLogOut, FiHeart, FiMapPin, FiEdit2, FiCamera } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { logout } from '../redux/slices/authSlice';
import { fetchOrders } from '../redux/slices/ordersSlice';
import { fetchWishlist } from '../redux/slices/wishlistSlice';
import { getProductImageUrl } from '../utils/productImages';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

function UserProfilePage() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.orders);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    dispatch(fetchOrders());
    dispatch(fetchWishlist());
  }, [isAuthenticated, navigate, dispatch]);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };
  const handlePlaceholderAction = (message) => {
    toast.success(message);
  };
  if (!isAuthenticated) return null;

  const TABS = [
    { id: 'orders', label: 'My Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-b border-gray-100">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button
                    type="button"
                    aria-label="Update profile photo"
                    onClick={() => handlePlaceholderAction('Profile photo editor not available yet.')}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors border border-gray-200"
                  >
                    <FiCamera className="text-sm" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.username || 'User'}</h2>
                <p className="text-sm text-gray-500 mt-1">{user?.email || 'user@example.com'}</p>
                <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  {user?.is_staff ? '👑 Admin' : '🏅 Premium Member'}
                </span>
              </div>
              <nav className="p-4 space-y-1">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${tab === t.id ? 'bg-primary text-white shadow-md shadow-primary/25' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <t.icon className="text-lg" /> {t.label}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Sign out"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-2 font-medium">
                  <FiLogOut className="text-lg" /> Sign Out
                </button>
              </nav>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{orders.length}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{wishlistItems.length}</p>
                <p className="text-xs text-gray-500">Wishlist</p>
              </div>
              <div className="text-center col-span-2">
                <p className="text-2xl font-bold text-accent">₹{orders.reduce((a, o) => a + parseFloat(o.total_price || 0), 0).toFixed(0)}</p>
                <p className="text-xs text-gray-500">Spent</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

              {/* Orders Tab */}
              {tab === 'orders' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Order History</h2>
                  {loading ? (
                    <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
                      <FiPackage className="text-6xl text-gray-200 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-6">Start shopping and your orders will appear here.</p>
                      <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors inline-block">
                        Shop Now
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center p-5 border-b border-gray-50">
                            <div>
                              <p className="font-bold text-gray-900">Order #{order.id}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-primary">₹{parseFloat(order.total_price).toFixed(2)}</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="px-5 pb-4 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold">Payment</span>
                              <span>{order.payment_method || 'N/A'}</span>
                            </div>
                            {order.payment_status && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-semibold">Payment Status</span>
                                <span>{order.payment_status}</span>
                              </div>
                            )}
                            {order.transaction_id && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-semibold">Txn ID</span>
                                <span className="truncate max-w-[180px] text-right">{order.transaction_id}</span>
                              </div>
                            )}
                            {order.coupon_code && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-semibold">Coupon</span>
                                <span className="text-green-600 font-medium">{order.coupon_code}</span>
                              </div>
                            )}
                            {order.discount_amount > 0 && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-semibold">Discount</span>
                                <span className="text-green-600">-₹{parseFloat(order.discount_amount).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                          {order.items && order.items.length > 0 && (
                            <div className="p-5 space-y-2">
                              {order.items.slice(0, 2).map((item) => (
                                <div key={item.id} className="flex items-center gap-3 text-sm">
                                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                                    {item.product?.title?.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800 line-clamp-1">{item.product?.title}</p>
                                    <p className="text-gray-500">Qty: {item.quantity} × ₹{parseFloat(item.price).toFixed(2)}</p>
                                  </div>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-xs text-gray-400">+{order.items.length - 2} more item(s)</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {tab === 'wishlist' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Saved Wishlist</h2>
                      <p className="text-sm text-gray-500">Your favorite products are saved here for quick access.</p>
                    </div>
                    <Link to="/wishlist" className="text-primary font-semibold hover:underline text-sm">
                      View Full Wishlist
                    </Link>
                  </div>
                  {wishlistItems.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                      <FiHeart className="text-6xl text-red-200 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-700 mb-2">No saved items yet</h3>
                      <p className="text-gray-500">Add products to your wishlist while browsing the store.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.slice(0, 4).map((item) => (
                        <div key={item.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img src={getProductImageUrl(item.product)} alt={item.product?.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 line-clamp-1">{item.product?.title}</p>
                            <p className="text-sm text-gray-500">₹{parseFloat(item.product?.price || 0).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {tab === 'addresses' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Saved Addresses</h2>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-start justify-between p-4 border border-dashed border-primary/30 rounded-xl bg-primary/5">
                      <div className="flex gap-3">
                        <FiMapPin className="text-primary text-xl mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-900">{user?.username}</p>
                          <p className="text-sm text-gray-500 mt-1">123 MG Road, Anna Nagar,<br />Chennai, Tamil Nadu 600040</p>
                          <span className="inline-block mt-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">Default</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Edit address"
                        onClick={() => handlePlaceholderAction('Address editing not available yet.')}
                        className="text-primary hover:text-green-800 transition-colors"
                      ><FiEdit2 /></button>
                    </div>
                    <button
                      type="button"
                      aria-label="Add new address"
                      onClick={() => handlePlaceholderAction('Add address flow not implemented yet.')}
                      className="w-full mt-4 border-2 border-dashed border-gray-200 rounded-xl py-4 text-gray-400 hover:border-primary hover:text-primary transition-colors font-medium"
                    >
                      + Add New Address
                    </button>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {tab === 'settings' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Account Settings</h2>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'First Name', value: user?.first_name || '', placeholder: 'John' },
                        { label: 'Last Name', value: user?.last_name || '', placeholder: 'Doe' },
                        { label: 'Email Address', value: user?.email || '', placeholder: 'john@example.com', colSpan: 2 },
                        { label: 'Phone Number', value: user?.phone_number || '', placeholder: '+91 9876543210', colSpan: 2 },
                      ].map((field) => (
                        <div key={field.label} className={field.colSpan === 2 ? 'md:col-span-2' : ''}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                          <input
                            type="text"
                            defaultValue={field.value}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none bg-gray-50"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <h3 className="font-bold text-gray-800 mb-4">Change Password</h3>
                      {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                        <div key={label} className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                          <input type="password" placeholder="••••••••"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none bg-gray-50" />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlaceholderAction('Account settings saved successfully.')}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
