import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12"
      >
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
          <FiShoppingBag className="text-5xl text-primary" />
        </div>
        <h1 className="mb-3 text-3xl font-black text-slate-950">Checkout Not Completed</h1>
        <p className="mb-8 text-slate-500">
          Sri Thanam Papers currently accepts Cash on Delivery. Return to checkout to place your order without online payment.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => navigate('/checkout')} className="rounded-xl bg-primary px-6 py-3 font-black text-white transition hover:bg-green-800">
            Return to Checkout
          </button>
          <button type="button" onClick={() => navigate('/cart')} className="rounded-xl border border-primary px-6 py-3 font-black text-primary transition hover:bg-primary hover:text-white">
            View Cart
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentCancelPage;
