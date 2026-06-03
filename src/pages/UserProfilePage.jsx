import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FiAlertTriangle,
  FiCamera,
  FiCheck,
  FiEdit2,
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiPackage,
  FiSettings,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { buildUrl } from '../utils/api';
import { logout } from '../redux/slices/authSlice';
import { cancelOrder, fetchOrders } from '../redux/slices/ordersSlice';
import { fetchWishlist } from '../redux/slices/wishlistSlice';
import ProductImage from '../components/ProductImage';
import { formatCurrency } from '../utils/formatters';

const STATUS_COLORS = {
  Pending: 'bg-amber-100 text-amber-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-violet-100 text-violet-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const tabs = [
  { id: 'orders', label: 'My Orders', icon: FiPackage },
  { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
  { id: 'addresses', label: 'Addresses', icon: FiMapPin },
  { id: 'settings', label: 'Settings', icon: FiSettings },
];

const emptyAddressForm = {
  full_name: '',
  phone_number: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: 'Tamil Nadu',
  postal_code: '',
  is_default: false,
};

function UserProfilePage() {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const { orders, loading, cancelling } = useSelector((state) => state.orders);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('orders');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressEditingId, setAddressEditingId] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchOrders());
    dispatch(fetchWishlist());
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchAddresses = async () => {
      setAddressesLoading(true);
      try {
        const response = await axios.get(buildUrl('/api/auth/addresses/'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data || []);
      } catch {
        toast.error('Could not load saved addresses.');
      } finally {
        setAddressesLoading(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, token]);

  const totalSpent = useMemo(
    () => orders.reduce((total, order) => total + Number.parseFloat(order.total_price || 0), 0),
    [orders],
  );

  const deliveredCount = useMemo(
    () => orders.filter((order) => order.status === 'Delivered').length,
    [orders],
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handlePlaceholderAction = (message) => {
    toast.success(message);
  };

  const confirmCancelOrder = async () => {
    if (!cancelTarget) return;
    const result = await dispatch(cancelOrder({ orderId: cancelTarget.id, reason: cancelReason }));
    if (!result.error) {
      setCancelTarget(null);
      setCancelReason('');
    }
  };

  const resetAddressForm = () => {
    setAddressForm(emptyAddressForm);
    setAddressEditingId(null);
  };

  const handleAddressChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAddressForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditAddress = (address) => {
    setAddressEditingId(address.id);
    setAddressForm({
      full_name: address.full_name || '',
      phone_number: address.phone_number || '',
      address_line1: address.address_line1 || '',
      address_line2: address.address_line2 || '',
      city: address.city || '',
      state: address.state || 'Tamil Nadu',
      postal_code: address.postal_code || '',
      is_default: Boolean(address.is_default),
    });
    setTab('addresses');
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();
    if (!addressForm.full_name.trim() || !addressForm.address_line1.trim() || !addressForm.city.trim() || !addressForm.postal_code.trim()) {
      toast.error('Please fill in all required address fields.');
      return;
    }

    setAddressSaving(true);
    try {
      const payload = {
        ...addressForm,
        full_name: addressForm.full_name.trim(),
        phone_number: addressForm.phone_number.trim(),
        address_line1: addressForm.address_line1.trim(),
        address_line2: addressForm.address_line2.trim(),
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        postal_code: addressForm.postal_code.trim(),
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = addressEditingId
        ? await axios.put(buildUrl(`/api/auth/addresses/${addressEditingId}/`), payload, config)
        : await axios.post(buildUrl('/api/auth/addresses/'), payload, config);

      setAddresses((current) => {
        const next = addressEditingId
          ? current.map((address) => (address.id === response.data.id ? response.data : address))
          : [response.data, ...current];
        return response.data.is_default
          ? next.map((address) => ({ ...address, is_default: address.id === response.data.id }))
          : next;
      });
      toast.success(addressEditingId ? 'Address updated.' : 'Address added.');
      resetAddressForm();
    } catch (error) {
      const detail = error.response?.data?.detail || 'Could not save address.';
      toast.error(detail);
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const shouldDelete = window.confirm('Delete this saved address?');
    if (!shouldDelete) return;

    try {
      await axios.delete(buildUrl(`/api/auth/addresses/${addressId}/`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses((current) => current.filter((address) => address.id !== addressId));
      if (addressEditingId === addressId) resetAddressForm();
      toast.success('Address deleted.');
    } catch {
      toast.error('Could not delete address.');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Customer dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">My Account</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          <aside>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center">
                <div className="relative mx-auto mb-4 h-24 w-24">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-3xl font-black text-white shadow-lg shadow-primary/20">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button
                    type="button"
                    aria-label="Update profile photo"
                    onClick={() => handlePlaceholderAction('Profile photo editor will be connected in a later profile API upgrade.')}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-primary shadow-md transition hover:bg-primary hover:text-white"
                  >
                    <FiCamera />
                  </button>
                </div>
                <h2 className="text-xl font-black text-slate-950">{user?.username || 'User'}</h2>
                <p className="mt-1 truncate text-sm font-semibold text-slate-500">{user?.email || 'user@example.com'}</p>
                <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                  {user?.is_staff ? 'Admin Account' : 'Premium Member'}
                </span>
              </div>

              <nav className="space-y-1 p-4">
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-selected={tab === item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-bold transition ${
                      tab === item.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                    }`}
                  >
                    <item.icon /> {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Sign out"
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-bold text-red-500 transition hover:bg-red-50"
                >
                  <FiLogOut /> Sign Out
                </button>
              </nav>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <Stat label="Orders" value={orders.length} />
              <Stat label="Delivered" value={deliveredCount} />
              <Stat label="Wishlist" value={wishlistItems.length} />
              <Stat label="Spent" value={formatCurrency(totalSpent)} />
            </div>
          </aside>

          <main className="min-w-0">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {tab === 'orders' && (
                <section>
                  <SectionHeader title="Order History" subtitle="Track orders, payments, cancellation state, and recent items." />
                  {loading ? (
                    <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-16">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : orders.length === 0 ? (
                    <EmptyState
                      icon={<FiPackage />}
                      title="No orders yet"
                      message="Start shopping and your order history will appear here."
                      action={<Link to="/products" className="rounded-xl bg-primary px-6 py-3 text-sm font-black text-white">Shop Now</Link>}
                    />
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <OrderCard key={order.id} order={order} onCancel={() => setCancelTarget(order)} />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {tab === 'wishlist' && (
                <section>
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <SectionHeader title="Saved Wishlist" subtitle="Quick access to your favorite stationery picks." />
                    <Link to="/wishlist" className="text-sm font-black text-primary hover:underline">View Full Wishlist -&gt;</Link>
                  </div>
                  {wishlistItems.length === 0 ? (
                    <EmptyState
                      icon={<FiHeart />}
                      title="No saved items yet"
                      message="Add products to your wishlist while browsing the store."
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {wishlistItems.slice(0, 4).map((item) => (
                        <Link key={item.id} to={`/product/${item.product?.id}`} className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-primary/25 hover:shadow-lg">
                          <ProductImage product={item.product} containerClassName="h-16 w-16 flex-shrink-0 rounded-2xl" />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 font-black text-slate-950">{item.product?.title}</p>
                            <p className="mt-1 text-sm font-black text-primary">{formatCurrency(item.product?.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {tab === 'addresses' && (
                <section>
                  <SectionHeader title="Saved Addresses" subtitle="Add, edit, and delete your delivery addresses." />
                  <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <h3 className="font-black text-slate-950">{addressEditingId ? 'Edit Address' : 'Add Address'}</h3>
                        {addressEditingId && (
                          <button
                            type="button"
                            onClick={resetAddressForm}
                            className="text-sm font-black text-slate-500 hover:text-primary"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleSaveAddress} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[
                          { name: 'full_name', label: 'Full Name *', placeholder: user?.username || 'Full name', colSpan: 2 },
                          { name: 'phone_number', label: 'Phone Number', placeholder: '+91 8610340098' },
                          { name: 'postal_code', label: 'Postal Code *', placeholder: '641001' },
                          { name: 'address_line1', label: 'Address Line 1 *', placeholder: 'Street, building, house no.', colSpan: 2 },
                          { name: 'address_line2', label: 'Address Line 2', placeholder: 'Area, landmark (optional)', colSpan: 2 },
                          { name: 'city', label: 'City *', placeholder: 'Coimbatore' },
                          { name: 'state', label: 'State', placeholder: 'Tamil Nadu' },
                        ].map((field) => (
                          <div key={field.name} className={field.colSpan === 2 ? 'md:col-span-2' : ''}>
                            <label className="mb-1 block text-sm font-black text-slate-700">{field.label}</label>
                            <input
                              type="text"
                              name={field.name}
                              value={addressForm[field.name]}
                              onChange={handleAddressChange}
                              placeholder={field.placeholder}
                              className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                            />
                          </div>
                        ))}

                        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 md:col-span-2">
                          <input
                            type="checkbox"
                            name="is_default"
                            checked={addressForm.is_default}
                            onChange={handleAddressChange}
                            className="h-4 w-4 accent-primary"
                          />
                          Set as default delivery address
                        </label>

                        <button
                          type="submit"
                          disabled={addressSaving}
                          className="rounded-xl bg-primary px-6 py-3 font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800 disabled:opacity-60 md:col-span-2"
                        >
                          {addressSaving ? 'Saving...' : addressEditingId ? 'Update Address' : 'Add Address'}
                        </button>
                      </form>
                    </div>

                    <div className="space-y-4">
                      {addressesLoading ? (
                        <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-14">
                          <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                      ) : addresses.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
                          <FiMapPin className="mx-auto mb-3 text-4xl text-slate-300" />
                          <p className="font-black text-slate-800">No saved addresses</p>
                          <p className="mt-2 text-sm leading-6 text-slate-500">Add your first delivery address using the form.</p>
                        </div>
                      ) : (
                        addresses.map((address) => (
                          <article key={address.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-black text-slate-950">{address.full_name}</p>
                                  {address.is_default && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-black text-primary">
                                      <FiCheck /> Default
                                    </span>
                                  )}
                                </div>
                                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                                  {address.address_line1}
                                  {address.address_line2 ? `, ${address.address_line2}` : ''}
                                </p>
                                <p className="text-sm font-semibold leading-6 text-slate-600">
                                  {address.city}, {address.state} {address.postal_code}
                                </p>
                                {address.phone_number && (
                                  <p className="mt-1 text-sm font-bold text-slate-500">{address.phone_number}</p>
                                )}
                              </div>
                              <div className="flex flex-shrink-0 gap-2">
                                <button
                                  type="button"
                                  aria-label="Edit address"
                                  onClick={() => handleEditAddress(address)}
                                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-primary transition hover:bg-primary hover:text-white"
                                >
                                  <FiEdit2 />
                                </button>
                                <button
                                  type="button"
                                  aria-label="Delete address"
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </div>
                </section>
              )}

              {tab === 'settings' && (
                <section>
                  <SectionHeader title="Account Settings" subtitle="Review your current profile details. Saving changes needs the profile update API in the next backend pass." />
                  <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[
                        { label: 'First Name', value: user?.first_name || '', placeholder: 'First name' },
                        { label: 'Last Name', value: user?.last_name || '', placeholder: 'Last name' },
                        { label: 'Email Address', value: user?.email || '', placeholder: 'email@example.com', colSpan: 2 },
                        { label: 'Phone Number', value: user?.phone_number || '', placeholder: '+91 8610340098', colSpan: 2 },
                      ].map((field) => (
                        <div key={field.label} className={field.colSpan === 2 ? 'md:col-span-2' : ''}>
                          <label className="mb-1 block text-sm font-black text-slate-700">{field.label}</label>
                          <input
                            type="text"
                            defaultValue={field.value}
                            placeholder={field.placeholder}
                            className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-5">
                      <h3 className="mb-4 font-black text-slate-800">Change Password</h3>
                      {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                        <div key={label} className="mb-3">
                          <label className="mb-1 block text-sm font-black text-slate-700">{label}</label>
                          <input
                            type="password"
                            placeholder="********"
                            className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlaceholderAction('Profile update API is required before these settings can persist.')}
                      className="rounded-xl bg-primary px-8 py-3 font-black text-white shadow-lg shadow-primary/20 transition hover:bg-green-800"
                    >
                      Save Changes
                    </button>
                  </div>
                </section>
              )}
            </motion.div>
          </main>
        </div>
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 px-4 py-4 sm:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <FiAlertTriangle />
                </div>
                <div>
                  <h3 className="font-black text-slate-950">Cancel Order #{cancelTarget.id}</h3>
                  <p className="text-xs font-semibold text-slate-500">This will mark the order as cancelled.</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close cancellation dialog"
                onClick={() => { setCancelTarget(null); setCancelReason(''); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX />
              </button>
            </div>
            <div className="p-6">
              <label className="mb-2 block text-sm font-black text-slate-700">Reason for cancellation</label>
              <textarea
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Optional: changed my mind, wrong item, duplicate order..."
                className="focus-ring w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
              <p className="mt-2 text-xs font-semibold text-slate-400">{cancelReason.length}/500 characters</p>
              <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => { setCancelTarget(null); setCancelReason(''); }}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 font-black text-slate-700 transition hover:bg-slate-50"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={confirmCancelOrder}
                  className="rounded-xl bg-red-600 px-5 py-2.5 font-black text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="truncate text-xl font-black text-primary">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
    </div>
  );
}

function EmptyState({ icon, title, message, action }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-4xl text-slate-300">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-800">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

function OrderCard({ order, onCancel }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-primary/20 hover:shadow-lg">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-slate-950">Order #{order.id}</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-lg font-black text-primary">{formatCurrency(order.total_price)}</p>
          <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-black ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-2 text-sm text-slate-600">
          <InfoRow label="Payment" value={order.payment_method || 'N/A'} />
          {order.payment_status && <InfoRow label="Payment Status" value={order.payment_status} />}
          {order.transaction_id && <InfoRow label="Txn ID" value={order.transaction_id} />}
          {order.coupon_code && <InfoRow label="Coupon" value={order.coupon_code} tone="success" />}
          {Number.parseFloat(order.discount_amount || 0) > 0 && (
            <InfoRow label="Discount" value={`-${formatCurrency(order.discount_amount)}`} tone="success" />
          )}
        </div>

        <div className="space-y-3">
          {order.items?.slice(0, 2).map((item) => (
            <div key={item.id} className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm">
              <ProductImage product={item.product} containerClassName="h-11 w-11 flex-shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-black text-slate-800">{item.product?.title}</p>
                <p className="font-semibold text-slate-500">Qty: {item.quantity} x {formatCurrency(item.price)}</p>
              </div>
            </div>
          ))}
          {order.items?.length > 2 && (
            <p className="text-xs font-bold text-slate-400">+{order.items.length - 2} more item(s)</p>
          )}
        </div>
      </div>

      {order.status === 'Cancelled' && order.cancelled_at && (
        <div className="mx-5 mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-red-700">
          <p className="font-black">
            Cancelled on {new Date(order.cancelled_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="mt-1 text-xs font-semibold">{order.cancellation_reason || 'Cancelled by customer'}</p>
        </div>
      )}

      {order.can_cancel && (
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-black text-red-600 transition hover:bg-red-50 sm:w-auto"
          >
            Cancel Order
          </button>
        </div>
      )}
    </article>
  );
}

function InfoRow({ label, value, tone }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-black text-slate-700">{label}</span>
      <span className={`truncate sm:max-w-[12rem] sm:text-right ${tone === 'success' ? 'font-black text-green-600' : 'font-semibold text-slate-500'}`}>
        {value}
      </span>
    </div>
  );
}

export default UserProfilePage;
