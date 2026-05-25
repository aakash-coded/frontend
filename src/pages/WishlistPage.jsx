import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getProductImageUrl } from '../utils/productImages';

function WishlistPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Please log in to view your wishlist</h2>
        <Link to="/login" className="bg-primary text-white px-8 py-3 rounded-full hover:bg-green-800 transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-xl text-gray-500 mb-6">Your wishlist is empty.</p>
            <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-full hover:bg-green-800 transition-colors">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col"
              >
                <Link to={`/product/${item.product.id}`} className="h-48 rounded-xl mb-4 overflow-hidden block">
                  <img
                    src={getProductImageUrl(item.product)}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="px-2 flex-grow flex flex-col">
                  <Link to={`/product/${item.product.id}`} className="font-semibold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {item.product.title}
                  </Link>
                  <p className="font-bold text-lg text-primary mb-4">₹{parseFloat(item.product.price || 0).toFixed(2)}</p>
                  <div className="mt-auto flex justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch(addToCart({ productId: item.product.id, quantity: 1 }))}
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-full font-semibold hover:bg-green-800 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                    <button
                      type="button"
                      aria-label="Remove from wishlist"
                      onClick={() => dispatch(removeFromWishlist(item.id))}
                      className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
