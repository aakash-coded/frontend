import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiAlertTriangle,
  FiBarChart2,
  FiBox,
  FiDollarSign,
  FiPackage,
  FiSearch,
  FiShoppingBag,
  FiTag,
  FiUsers,
} from 'react-icons/fi';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchOrders } from '../redux/slices/ordersSlice';
import ProductImage from '../components/ProductImage';
import { buildUrl } from '../utils/api';
import { formatCurrency } from '../utils/formatters';

const statusColors = {
  Pending: 'bg-amber-100 text-amber-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-violet-100 text-violet-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: FiBarChart2 },
  { id: 'orders', label: 'Orders', icon: FiPackage },
  { id: 'products', label: 'Inventory', icon: FiBox },
  { id: 'customers', label: 'Customers', icon: FiUsers },
  { id: 'coupons', label: 'Coupons', icon: FiTag },
];

function AdminDashboardPage() {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { items: products, loading: productsLoading } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tab, setTab] = useState('overview');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('All');
  const [productSearch, setProductSearch] = useState('');
  const [couponSearch, setCouponSearch] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user && !user.is_staff) {
      navigate('/');
      return;
    }
    dispatch(fetchOrders());
    dispatch(fetchProducts(''));
  }, [dispatch, isAuthenticated, navigate, user]);

  useEffect(() => {
    if (!token || !user?.is_staff) return;
    const fetchCoupons = async () => {
      setCouponLoading(true);
      try {
        const response = await axios.get(buildUrl('/api/orders/coupons/'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupons(Array.isArray(response.data) ? response.data : response.data.results || []);
      } catch {
        setCoupons([]);
      } finally {
        setCouponLoading(false);
      }
    };
    fetchCoupons();
  }, [token, user]);

  const analytics = useMemo(() => {
    const revenue = orders.reduce((total, order) => total + Number.parseFloat(order.total_price || 0), 0);
    const activeOrders = orders.filter((order) => !['Delivered', 'Cancelled'].includes(order.status)).length;
    const lowStock = products.filter((product) => Number(product.stock_quantity || 0) > 0 && Number(product.stock_quantity || 0) <= 10).length;
    const outOfStock = products.filter((product) => Number(product.stock_quantity || 0) === 0).length;
    const customers = new Map();
    orders.forEach((order) => {
      const name = order.user_name || 'Customer';
      const existing = customers.get(name) || { name, orders: 0, spent: 0 };
      existing.orders += 1;
      existing.spent += Number.parseFloat(order.total_price || 0);
      customers.set(name, existing);
    });
    return {
      revenue,
      activeOrders,
      lowStock,
      outOfStock,
      customers: [...customers.values()].sort((a, b) => b.spent - a.spent),
    };
  }, [orders, products]);

  const monthBars = useMemo(() => {
    const totals = Array.from({ length: 12 }, (_, index) => ({ index, total: 0 }));
    orders.forEach((order) => {
      const date = new Date(order.created_at);
      if (!Number.isNaN(date.getTime())) {
        totals[date.getMonth()].total += Number.parseFloat(order.total_price || 0);
      }
    });
    const max = Math.max(...totals.map((item) => item.total), 1);
    return totals.map((item) => ({ ...item, percent: Math.max((item.total / max) * 100, item.total ? 8 : 2) }));
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const term = orderSearch.trim().toLowerCase();
    const matchesSearch = !term
      || String(order.id).includes(term)
      || String(order.user_name || '').toLowerCase().includes(term)
      || String(order.payment_method || '').toLowerCase().includes(term);
    const matchesStatus = orderStatus === 'All' || order.status === orderStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter((product) => {
    const term = productSearch.trim().toLowerCase();
    return !term
      || String(product.title || '').toLowerCase().includes(term)
      || String(product.category_name || '').toLowerCase().includes(term)
      || String(product.brand || '').toLowerCase().includes(term);
  });

  const filteredCoupons = coupons.filter((coupon) => (
    !couponSearch.trim()
    || String(coupon.code || '').toLowerCase().includes(couponSearch.trim().toLowerCase())
    || String(coupon.description || '').toLowerCase().includes(couponSearch.trim().toLowerCase())
  ));

  const updateOrderStatus = async (orderId, status) => {
    setStatusUpdating(orderId);
    try {
      await axios.patch(
        buildUrl(`/api/orders/${orderId}/update_status/`),
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success('Order status updated.');
      dispatch(fetchOrders());
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update order status.');
    } finally {
      setStatusUpdating(null);
    }
  };

  if (!isAuthenticated || (user && !user.is_staff)) return null;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white shadow-sm lg:flex">
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Sri Thanam Papers</p>
            <p className="mt-1 text-xl font-black text-primary">Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {tabs.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-black transition ${
                tab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
              }`}
            >
              <item.icon /> {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-primary/5 p-4">
            <p className="text-xs font-bold text-slate-500">Signed in as</p>
            <p className="mt-1 truncate text-sm font-black text-primary">{user?.username || 'Admin'}</p>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 lg:hidden">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Sri Thanam Papers</p>
            <h1 className="mt-1 text-2xl font-black text-slate-950">Admin Console</h1>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black ${
                  tab === item.id ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-slate-600'
                }`}
              >
                <item.icon /> {item.label}
              </button>
            ))}
          </div>
        </div>

        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Management</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              {tab === 'overview' && 'Dashboard Overview'}
              {tab === 'orders' && 'Order Management'}
              {tab === 'products' && 'Inventory Management'}
              {tab === 'customers' && 'Customer Insights'}
              {tab === 'coupons' && 'Coupon Management'}
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">Live data from your existing products and orders APIs.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={FiDollarSign} label="Total Revenue" value={formatCurrency(analytics.revenue)} helper="All recorded orders" color="bg-green-100 text-green-700" />
                <StatCard icon={FiShoppingBag} label="Total Orders" value={orders.length} helper={`${analytics.activeOrders} active`} color="bg-blue-100 text-blue-700" />
                <StatCard icon={FiBox} label="Products" value={products.length} helper={`${analytics.lowStock} low stock`} color="bg-violet-100 text-violet-700" />
                <StatCard icon={FiUsers} label="Customers" value={analytics.customers.length} helper="From order history" color="bg-amber-100 text-amber-700" />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-950">Monthly Revenue</h2>
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">This year</span>
                  </div>
                  <div className="flex h-48 items-end gap-2">
                    {monthBars.map((item) => (
                      <div key={item.index} className="flex flex-1 flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${item.percent}%` }}
                          transition={{ delay: item.index * 0.03, duration: 0.45 }}
                          className="w-full rounded-t-xl bg-primary transition hover:bg-green-700"
                          title={formatCurrency(item.total)}
                        />
                        <span className="text-xs font-bold text-slate-400">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][item.index]}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-black text-slate-950">Inventory Alerts</h2>
                  <div className="mt-5 space-y-3">
                    <AlertRow tone="red" label="Out of stock" value={analytics.outOfStock} />
                    <AlertRow tone="amber" label="Low stock" value={analytics.lowStock} />
                    <AlertRow tone="green" label="Available products" value={products.length - analytics.outOfStock} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab('products')}
                    className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-black text-white transition hover:bg-green-800"
                  >
                    Review Inventory
                  </button>
                </section>
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-950">Recent Orders</h2>
                  <button type="button" onClick={() => setTab('orders')} className="text-sm font-black text-primary hover:underline">
                    View all
                  </button>
                </div>
                <OrdersTable orders={orders.slice(0, 5)} onStatusChange={updateOrderStatus} statusUpdating={statusUpdating} compact />
              </section>
            </div>
          )}

          {tab === 'orders' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex flex-col gap-3 md:flex-row">
                <SearchBox value={orderSearch} onChange={setOrderSearch} placeholder="Search orders, customers, payment..." />
                <select
                  value={orderStatus}
                  onChange={(event) => setOrderStatus(event.target.value)}
                  className="focus-ring rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
                >
                  {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              {ordersLoading ? <LoadingBlock /> : <OrdersTable orders={filteredOrders} onStatusChange={updateOrderStatus} statusUpdating={statusUpdating} />}
            </section>
          )}

          {tab === 'products' && (
            <section className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SearchBox value={productSearch} onChange={setProductSearch} placeholder="Search products, categories, brands..." />
                <button
                  type="button"
                  onClick={() => toast('Product create/edit needs writable product admin API support.')}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-green-800"
                >
                  Add Product
                </button>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                {productsLoading ? <LoadingBlock /> : <ProductsTable products={filteredProducts} />}
              </div>
            </section>
          )}

          {tab === 'customers' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              {analytics.customers.length === 0 ? (
                <EmptyState title="No customer data yet" message="Customer insights are derived from order history." />
              ) : (
                <div className="space-y-3">
                  {analytics.customers.map((customer) => (
                    <div key={customer.name} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-white">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-black text-slate-950">{customer.name}</p>
                        <p className="text-sm font-semibold text-slate-500">{customer.orders} order{customer.orders !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary">{formatCurrency(customer.spent)}</p>
                        <p className="text-xs font-bold text-slate-400">Lifetime value</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === 'coupons' && (
            <section className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SearchBox value={couponSearch} onChange={setCouponSearch} placeholder="Search coupons..." />
                <button
                  type="button"
                  onClick={() => toast('Coupon create/edit UI can be connected to the existing admin coupon API next.')}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-green-800"
                >
                  Create Coupon
                </button>
              </div>
              {couponLoading ? (
                <LoadingBlock />
              ) : filteredCoupons.length === 0 ? (
                <EmptyState title="No coupons found" message="Create coupons in Django admin or connect the admin coupon form in the next pass." />
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCoupons.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} />)}
                </div>
              )}
            </section>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, helper, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="text-xl" />
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">{helper}</span>
      </div>
      <p className="truncate text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
    </motion.div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative min-w-0 flex-1">
      <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="focus-ring w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-slate-900"
      />
    </div>
  );
}

function OrdersTable({ orders, onStatusChange, statusUpdating, compact = false }) {
  if (!orders.length) {
    return <EmptyState title="No orders found" message="Orders will appear here as customers place them." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-500">
            <th className="pb-3 font-black">Order</th>
            <th className="pb-3 font-black">Customer</th>
            <th className="pb-3 font-black">Date</th>
            <th className="pb-3 font-black">Amount</th>
            <th className="pb-3 font-black">Status</th>
            {!compact && <th className="pb-3 font-black">Update</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id} className="transition hover:bg-slate-50">
              <td className="py-4 font-mono font-black text-slate-700">#{order.id}</td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary">
                    {(order.user_name || 'C').charAt(0).toUpperCase()}
                  </span>
                  <span className="font-bold text-slate-700">{order.user_name || 'Customer'}</span>
                </div>
              </td>
              <td className="py-4 font-semibold text-slate-500">
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td className="py-4 font-black text-slate-950">{formatCurrency(order.total_price)}</td>
              <td className="py-4">
                <span className={`rounded-full px-2.5 py-1 text-xs font-black ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}>
                  {order.status}
                </span>
              </td>
              {!compact && (
                <td className="py-4">
                  <select
                    value={order.status}
                    disabled={statusUpdating === order.id}
                    onChange={(event) => onStatusChange(order.id, event.target.value)}
                    className="focus-ring rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-black text-slate-700 disabled:opacity-50"
                  >
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsTable({ products }) {
  if (!products.length) {
    return <EmptyState title="No products found" message="Products will appear after they are available in the product API." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-500">
            <th className="pb-3 font-black">Product</th>
            <th className="pb-3 font-black">Category</th>
            <th className="pb-3 font-black">Price</th>
            <th className="pb-3 font-black">Stock</th>
            <th className="pb-3 font-black">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => {
            const stock = Number(product.stock_quantity || 0);
            const status = stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'Active';
            return (
              <tr key={product.id} className="transition hover:bg-slate-50">
                <td className="py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <ProductImage product={product} containerClassName="h-11 w-11 flex-shrink-0 rounded-xl" />
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-black text-slate-900">{product.title}</p>
                      <p className="text-xs font-semibold text-slate-400">{product.brand || 'Sri Thanam Papers'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-bold text-slate-600">{product.category_name || 'Stationery'}</td>
                <td className="py-4 font-black text-primary">{formatCurrency(product.price)}</td>
                <td className="py-4 font-black text-slate-800">{stock}</td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${
                    status === 'Out of Stock'
                      ? 'bg-red-100 text-red-700'
                      : status === 'Low Stock'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {status !== 'Active' && <FiAlertTriangle />} {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CouponCard({ coupon }) {
  const discount = Number(coupon.discount_amount || 0) > 0
    ? formatCurrency(coupon.discount_amount)
    : `${coupon.discount_percent || 0}%`;
  const usage = coupon.usage_limit ? `${coupon.times_used}/${coupon.usage_limit}` : `${coupon.times_used || 0}`;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="rounded-xl bg-primary/10 px-3 py-1 font-mono text-lg font-black text-primary">{coupon.code}</span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-black ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {coupon.active ? 'Active' : 'Inactive'}
        </span>
      </div>
      <p className="text-2xl font-black text-slate-950">{discount} <span className="text-sm font-bold text-slate-500">off</span></p>
      <div className="mt-4 space-y-1 text-xs font-semibold text-slate-500">
        <p>Minimum order: {formatCurrency(coupon.min_order_value)}</p>
        <p>Usage: {usage}</p>
        <p>Expires: {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('en-IN') : 'No expiry'}</p>
      </div>
    </article>
  );
}

function AlertRow({ label, value, tone }) {
  const color = {
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-green-50 text-green-700',
  }[tone];
  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${color}`}>
      <span className="font-black">{label}</span>
      <span className="text-xl font-black">{value}</span>
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-12 text-center">
      <h3 className="text-lg font-black text-slate-800">{title}</h3>
      <p className="mt-2 text-sm font-semibold text-slate-500">{message}</p>
    </div>
  );
}

export default AdminDashboardPage;
