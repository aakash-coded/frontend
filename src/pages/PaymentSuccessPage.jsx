import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function PaymentSuccessPage() {
  const navigate = useNavigate();

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
        <p className="mb-2 text-slate-500">Your Sri Thanam Papers order has been placed successfully.</p>
        <p className="mb-8 text-slate-500">Payment will be collected by cash when the order is delivered.</p>

        <div className="mb-8 rounded-2xl bg-primary/5 p-4 text-left">
          <div className="flex gap-3">
            <FiPackage className="mt-1 flex-shrink-0 text-primary" />
            <div>
              <p className="font-black text-slate-950">Cash on Delivery</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Please keep the payable amount ready at delivery. You can track the order from your account dashboard.
              </p>
            </div>
          </div>
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

export default PaymentSuccessPage;
