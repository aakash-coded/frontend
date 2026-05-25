import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

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
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful! 🎉</h1>
        <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
        <p className="text-gray-500 mb-8">Your order has been confirmed and we will email you a receipt.</p>
        
        {sessionId && (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-8 text-xs text-gray-400 break-all">
            Session: {sessionId}
          </div>
        )}

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

export default PaymentSuccessPage;
