import { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { buildUrl } from '../utils/api';

const API_URL = buildUrl('/api/auth/');

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ResetPasswordPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const uid = useMemo(() => query.get('uid') || '', [query]);
  const token = useMemo(() => query.get('token') || '', [query]);
  const email = useMemo(() => query.get('email') || '', [query]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!uid || !token || !email) {
      toast.error('Invalid password reset link.');
      return;
    }

    try {
      await axios.post(API_URL + 'reset-password/', {
        email,
        uid,
        token,
        password,
      });
      setSubmitted(true);
      toast.success('Password reset successfully.');
    } catch (error) {
      const message = error.response?.data?.detail || 'Unable to reset password.';
      toast.error(message);
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
                  <FiLock className="text-primary text-2xl" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-500 mt-2">Set a new password for your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-gray-900 bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-gray-900 bg-gray-50"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-lg hover:bg-green-800 transition-colors shadow-lg shadow-primary/30"
                >
                  Reset Password
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
              <p className="text-gray-500 mb-6">
                Your password has been changed. You can now sign in with your new credentials.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition-colors"
              >
                Go to Login
              </button>
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

export default ResetPasswordPage;
