import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { wishlist, isLoading } = useAppSelector((s) => s.wishlist);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = async (productId: string, name: string) => {
    const result = await dispatch(removeFromWishlist(productId));
    if (removeFromWishlist.fulfilled.match(result)) {
      toast.success(`${name} removed from wishlist`);
    }
  };

  const handleMoveToCart = async (productId: string, name: string) => {
    const cartResult = await dispatch(addToCart({ productId, quantity: 1 }));
    if (addToCart.fulfilled.match(cartResult)) {
      await dispatch(removeFromWishlist(productId));
      toast.success(`${name} moved to cart`);
    }
  };

  if (isLoading && !wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50 pt-24">
        <LoadingSpinner size="lg" text="Loading wishlist..." />
      </div>
    );
  }

  const isEmpty = !wishlist || wishlist.products.length === 0;

  return (
    <div className="min-h-screen bg-earth-50 pt-28 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif text-earth-900 mb-2">
            My Wishlist
          </h1>
          <p className="text-earth-500 text-sm mb-10">
            {isEmpty
              ? 'Your wishlist is empty'
              : `${wishlist!.products.length} item${wishlist!.products.length > 1 ? 's' : ''} saved`}
          </p>
        </motion.div>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={36} className="text-earth-400" />
            </div>
            <h2 className="text-xl font-serif text-earth-700 mb-3">
              No saved items yet
            </h2>
            <p className="text-earth-500 mb-8 max-w-md mx-auto">
              Save items you love to your wishlist so you can find them easily later.
            </p>
            <Link to="/products">
              <Button variant="primary" size="md" className="group">
                Explore Collection
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist!.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="bg-white rounded-sm shadow-sm border border-earth-100 overflow-hidden group"
              >
                <Link
                  to={`/products/${product.id}`}
                  className="block relative aspect-[3/4] overflow-hidden bg-earth-100"
                >
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </Link>

                <div className="p-4">
                  <p className="text-xs text-earth-500 uppercase tracking-wider mb-1">
                    {product.category}
                  </p>
                  <Link
                    to={`/products/${product.id}`}
                    className="font-serif text-lg text-earth-900 hover:text-gold-600 transition-colors block mb-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-earth-700 font-medium mb-4">
                    {product.formattedPrice}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(product.id, product.name)}
                      className="flex-1 flex items-center justify-center gap-2 bg-earth-900 text-earth-50 py-2.5 rounded-sm text-sm font-medium hover:bg-earth-800 transition-colors"
                    >
                      <ShoppingBag size={14} />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product.id, product.name)}
                      className="p-2.5 border border-earth-200 rounded-sm text-earth-400 hover:text-red-500 hover:border-red-200 transition-all"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
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
