import { motion } from 'framer-motion';
import { FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function PaymentCancelPage() {
  const navigate = useNavigate();

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
          className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiXCircle className="text-red-500 text-5xl" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8">Your payment process was cancelled or failed. Your order has not been completed.</p>
        
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/checkout')}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors"
          >
            Try Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/cart')}
            className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Return to Cart
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentCancelPage;
