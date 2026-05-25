import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { buildUrl } from '../utils/api';

const API_URL = buildUrl('/api/auth/');

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    try {
      const response = await axios.post(API_URL + 'forgot-password/', { email });
      setSubmitted(true);
      setResetUrl(response.data.reset_url || '');
      toast.success('Password reset link sent!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to send reset link.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-2xl">
            <span className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white text-lg font-black">S</span>
            Sri Thanam Papers
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-primary text-2xl" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="text-gray-500 mt-2">No worries! Enter your email and we'll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-gray-900 bg-gray-50"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-lg hover:bg-green-800 transition-colors shadow-lg shadow-primary/30"
                >
                  Send Reset Link
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email!</h2>
              <p className="text-gray-500 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
              </p>
                <p className="text-sm text-gray-400">
                Didn't receive the email? Check your spam folder or{' '}
                <button type="button" onClick={() => setSubmitted(false)} className="text-primary font-semibold hover:underline">
                  try again
                </button>.
              </p>
              {resetUrl && (
                <div className="mt-4 text-left bg-green-50 border border-green-100 p-4 rounded-2xl">
                  <p className="text-sm text-green-700 mb-2">Dev reset link:</p>
                  <a href={resetUrl} className="text-primary font-semibold hover:underline break-all">
                    {resetUrl}
                  </a>
                </div>
              )}
            </motion.div>
          )}

          <div className="text-center mt-6">
            <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium text-sm">
              <FiArrowLeft /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPage;
