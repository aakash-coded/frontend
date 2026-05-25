import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiBox, FiUsers, FiDollarSign, FiTrendingUp, FiShoppingBag, FiTag, FiBarChart2, FiPackage } from 'react-icons/fi';

const MOCK_ORDERS = [
  { id: '#ORD-1042', customer: 'Priya Sharma', date: 'Today, 2:30 PM', amount: '₹1,450', status: 'Processing', avatar: 'P' },
  { id: '#ORD-1041', customer: 'Rahul Verma', date: 'Today, 11:15 AM', amount: '₹890', status: 'Shipped', avatar: 'R' },
  { id: '#ORD-1040', customer: 'Alice Johnson', date: 'Yesterday', amount: '₹2,100', status: 'Delivered', avatar: 'A' },
  { id: '#ORD-1039', customer: 'Kiran Patel', date: 'Yesterday', amount: '₹560', status: 'Pending', avatar: 'K' },
  { id: '#ORD-1038', customer: 'Sunita Devi', date: '2 days ago', amount: '₹3,250', status: 'Delivered', avatar: 'S' },
];

const MOCK_PRODUCTS = [
  { name: 'Premium A4 Notebook', stock: 145, sold: 89, revenue: '₹8,900', status: 'Active' },
  { name: 'Fountain Pen Set', stock: 32, sold: 201, revenue: '₹20,100', status: 'Active' },
  { name: 'Sticky Notes Bundle', stock: 0, sold: 412, revenue: '₹12,360', status: 'Out of Stock' },
  { name: 'Leather Journal', stock: 67, sold: 55, revenue: '₹13,750', status: 'Active' },
  { name: 'Whiteboard Markers', stock: 200, sold: 134, revenue: '₹4,020', status: 'Active' },
];

const STATUS_COLORS = {
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
};

function StatCard({ icon: Icon, label, value, change, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="text-xl" />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </motion.div>
  );
}

function AdminDashboardPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const TABS = [
    { id: 'overview', label: 'Overview', icon: FiBarChart2 },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'products', label: 'Products', icon: FiBox },
    { id: 'customers', label: 'Customers', icon: FiUsers },
    { id: 'coupons', label: 'Coupons', icon: FiTag },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="font-bold text-lg text-primary">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map((t) => (
            <button type="button" key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${tab === t.id ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
              <t.icon className="text-lg" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="bg-primary/5 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Sri Thanam Papers</p>
            <p className="text-xs font-semibold text-primary mt-1">Admin v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {tab === 'overview' && 'Dashboard Overview'}
              {tab === 'orders' && 'Order Management'}
              {tab === 'products' && 'Product Inventory'}
              {tab === 'customers' && 'Customer Management'}
              {tab === 'coupons' && 'Coupon Management'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, Admin!</p>
          </div>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

          {/* Overview Tab */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard icon={FiDollarSign} label="Total Revenue" value="₹1,24,500" change="+15.3%" color="bg-green-100 text-green-700" />
                <StatCard icon={FiShoppingBag} label="Total Orders" value="1,284" change="+8.2%" color="bg-blue-100 text-blue-700" />
                <StatCard icon={FiBox} label="Total Products" value="124" change="+3 new" color="bg-purple-100 text-purple-700" />
                <StatCard icon={FiUsers} label="Customers" value="892" change="+12 week" color="bg-amber-100 text-amber-700" />
              </div>

              {/* Revenue Bar Chart (visual) */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Revenue</h2>
                <div className="flex items-end gap-2 h-40">
                  {[40, 65, 50, 80, 75, 90, 70, 85, 95, 110, 100, 124].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(h / 124) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="w-full bg-primary rounded-t-lg hover:bg-green-600 transition-colors cursor-pointer"
                        title={`₹${h * 1000}`}
                      />
                      <span className="text-xs text-gray-400">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                  <button
                    type="button"
                    onClick={() => { setTab('orders'); toast.success('Viewing orders'); }}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-gray-500 border-b border-gray-100">
                      <th className="pb-3 font-medium text-left">Order</th>
                      <th className="pb-3 font-medium text-left">Customer</th>
                      <th className="pb-3 font-medium text-left">Date</th>
                      <th className="pb-3 font-medium text-left">Amount</th>
                      <th className="pb-3 font-medium text-left">Status</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {MOCK_ORDERS.slice(0, 3).map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 font-mono font-medium text-gray-700">{o.id}</td>
                          <td className="py-3 flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">{o.avatar}</div>
                            {o.customer}
                          </td>
                          <td className="py-3 text-gray-500">{o.date}</td>
                          <td className="py-3 font-bold">{o.amount}</td>
                          <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex gap-3 mb-6">
                <input placeholder="Search orders..." className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none" />
                <select className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none">
                  <option>All Status</option>
                  <option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium text-left">Order ID</th>
                    <th className="pb-3 font-medium text-left">Customer</th>
                    <th className="pb-3 font-medium text-left">Date</th>
                    <th className="pb-3 font-medium text-left">Amount</th>
                    <th className="pb-3 font-medium text-left">Status</th>
                    <th className="pb-3 font-medium text-left">Action</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_ORDERS.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-mono font-medium text-gray-700">{o.id}</td>
                        <td className="py-3 flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">{o.avatar}</div>
                          {o.customer}
                        </td>
                        <td className="py-3 text-gray-500">{o.date}</td>
                        <td className="py-3 font-bold">{o.amount}</td>
                        <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                        <td className="py-3">
                          <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:border-primary focus:outline-none">
                            <option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {tab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <input placeholder="Search products..." className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none w-72" />
                <button
                  type="button"
                  onClick={() => toast.success('Add product flow not ready yet.')}
                  className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors"
                >
                  + Add Product
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium text-left">Product</th>
                    <th className="pb-3 font-medium text-left">Stock</th>
                    <th className="pb-3 font-medium text-left">Sold</th>
                    <th className="pb-3 font-medium text-left">Revenue</th>
                    <th className="pb-3 font-medium text-left">Status</th>
                    <th className="pb-3 font-medium text-left">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_PRODUCTS.map((p) => (
                      <tr key={p.name} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-medium text-gray-800">{p.name}</td>
                        <td className="py-3"><span className={p.stock === 0 ? 'text-red-500 font-semibold' : 'text-gray-700'}>{p.stock === 0 ? 'Out of Stock' : p.stock}</span></td>
                        <td className="py-3 text-gray-600">{p.sold}</td>
                        <td className="py-3 font-bold text-green-600">{p.revenue}</td>
                        <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span></td>
                        <td className="py-3 flex gap-2">
                          <button
                          type="button"
                          onClick={() => toast.success('Edit product action is not available yet.')}
                          className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-lg hover:bg-primary hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                          <button
                            type="button"
                            onClick={() => toast.success('Delete product action is not available yet.')}
                            className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {tab === 'customers' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <input placeholder="Search customers..." className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-primary focus:outline-none w-full mb-6" />
              <div className="space-y-3">
                {['Priya S.', 'Rahul V.', 'Alice J.', 'Kiran P.', 'Sunita D.'].map((name, i) => (
                  <div key={name} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm">{name.charAt(0)}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-500">{name.toLowerCase().replace(/\s/, '') + '@example.com'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">₹{(Math.random() * 5000 + 500).toFixed(0)}</p>
                      <p className="text-xs text-gray-400">{Math.floor(Math.random() * 10 + 1)} orders</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupons Tab */}
          {tab === 'coupons' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => toast.success('Coupon creation flow coming soon.')}
                className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors"
              >
                + Create Coupon
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { code: 'SAVE10', discount: '10%', uses: '142/500', expiry: 'Dec 31, 2026', active: true },
                  { code: 'WELCOME20', discount: '20%', uses: '38/100', expiry: 'Jun 30, 2026', active: true },
                  { code: 'SRITHANAM', discount: '15%', uses: '89/200', expiry: 'Mar 31, 2026', active: false },
                ].map((c) => (
                  <div key={c.code} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-mono font-bold text-lg text-primary bg-primary/10 px-3 py-1 rounded-lg">{c.code}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.active ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{c.discount} <span className="text-sm text-gray-500 font-normal">off</span></p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Uses: {c.uses}</p>
                      <p>Expires: {c.expiry}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => toast.success('Edit coupon flow not implemented yet.')}
                        className="flex-1 text-xs bg-primary/10 text-primary py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.success('Delete coupon flow not implemented yet.')}
                        className="flex-1 text-xs bg-red-50 text-red-500 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </main>
    </div>
  );
}

export default AdminDashboardPage;
