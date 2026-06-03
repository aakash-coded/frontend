import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiBell, FiCheckCircle, FiPackage, FiTruck, FiXCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/slices/ordersSlice';

const statusIcons = {
  Delivered: FiCheckCircle,
  Cancelled: FiXCircle,
  Shipped: FiTruck,
  Processing: FiPackage,
  Pending: FiPackage,
};

function NotificationBell() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    if (isAuthenticated && orders.length === 0) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated, orders.length]);

  const notifications = useMemo(() => {
    const orderItems = orders.slice(0, 5).map((order) => {
      const Icon = statusIcons[order.status] || FiPackage;
      return {
        id: `order-${order.id}`,
        Icon,
        title: `Order #${order.id} is ${order.status}`,
        message: order.payment_method === 'Cash on Delivery'
          ? 'Cash will be collected at delivery.'
          : order.payment_method || 'Order update available.',
        tone: order.status === 'Cancelled' ? 'danger' : order.status === 'Delivered' ? 'success' : 'default',
      };
    });

    if (!orderItems.length) {
      return [{
        id: 'cod-ready',
        Icon: FiPackage,
        title: 'Cash on Delivery enabled',
        message: 'Place an order and pay when it arrives.',
        tone: 'default',
      }];
    }

    return orderItems;
  }, [orders]);

  if (!isAuthenticated) return null;

  const activeCount = orders.filter((order) => ['Pending', 'Processing', 'Shipped'].includes(order.status)).length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="View notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-primary/30 hover:text-primary"
      >
        <FiBell />
        {activeCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-black text-slate-950">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 top-12 z-30 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="font-black text-slate-950">Notifications</p>
              <p className="text-xs font-semibold text-slate-400">Order and COD updates</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(({ id, Icon, title, message, tone }) => (
                <div key={id} className="flex gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0">
                  <span className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                    tone === 'danger'
                      ? 'bg-red-50 text-red-500'
                      : tone === 'success'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-primary/10 text-primary'
                  }`}>
                    <Icon />
                  </span>
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-black text-slate-950">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{message}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-black text-primary hover:bg-primary/5"
            >
              View order history
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;
