import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Box } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { ARModal } from './ARModal';
import toast from 'react-hot-toast';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showAR, setShowAR] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { wishlist } = useAppSelector((s) => s.wishlist);

  const isInWishlist = wishlist?.products.some((p) => p.id === product.id) ?? false;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    const result = await dispatch(addToCart({ productId: product.id, quantity: 1 }));
    if (addToCart.fulfilled.match(result)) {
      toast.success(`${product.name} added to cart`);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (isInWishlist) {
      await dispatch(removeFromWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      await dispatch(addToWishlist(product.id));
      toast.success('Added to wishlist');
    }
  };

  const handleARClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAR(true);
  };

  return (
    <>
      <Link to={`/products/${product.id}`} className="block">
        <motion.div
          className="group relative bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 rounded-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-earth-100">
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Wishlist button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all z-10"
            >
              <Heart
                size={16}
                className={
                  isInWishlist
                    ? 'text-red-500 fill-red-500'
                    : 'text-earth-500 hover:text-red-500'
                }
              />
            </button>

            {/* Rating badge */}
            {product.ratings.average > 0 && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium z-10">
                <Star size={12} className="text-gold-500 fill-gold-500" />
                <span className="text-earth-800">{product.ratings.average}</span>
              </div>
            )}

            {/* Hover actions */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-earth-900 text-white px-4 py-2.5 rounded-sm text-sm font-medium hover:bg-earth-800 transition-colors shadow-lg"
              >
                <ShoppingBag size={14} />
                Add to Cart
              </button>
              {product.glbAsset && (
                <button
                  onClick={handleARClick}
                  className="flex items-center gap-2 bg-gold-500 text-earth-900 px-4 py-2.5 rounded-sm text-sm font-medium hover:bg-gold-600 transition-colors shadow-lg"
                >
                  <Box size={14} />
                  3D View
                </button>
              )}
            </div>
          </div>

          <div className="p-4 text-center">
            <p className="text-xs text-earth-500 uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-serif text-lg text-earth-900 mb-1">{product.name}</h3>
            <p className="text-earth-700 font-medium">{product.formattedPrice}</p>
          </div>
        </motion.div>
      </Link>

      {product.glbAsset && (
        <ARModal
          isOpen={showAR}
          onClose={() => setShowAR(false)}
          glbAsset={product.glbAsset}
          productName={product.name}
        />
      )}
    </>
  );
}
