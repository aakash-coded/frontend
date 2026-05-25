import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-9xl font-extrabold text-primary/10 select-none mb-4">404</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
          Oops! Looks like this page wandered off like a lost sticky note.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-green-800 transition-colors shadow-lg shadow-primary/30"
          >
            Back to Home
          </Link>
          <Link
            to="/products"
            className="bg-white text-primary px-8 py-3 rounded-full font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
