import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Star, Box, Minus, Plus, Check, MapPin } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductById, clearSelectedProduct, fetchProducts } from '../store/slices/productSlice';
import { addToCart, fetchCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../store/slices/wishlistSlice';
import { ProductCard } from '../components/ProductCard';
import { ARModal } from '../components/ARModal';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, isLoadingDetail, products } = useAppSelector((s) => s.products);
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { wishlist } = useAppSelector((s) => s.wishlist);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAR, setShowAR] = useState(false);

  const isInWishlist = wishlist?.products.some((p) => p.id === id) ?? false;

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  // Fetch related products
  useEffect(() => {
    if (product?.category) {
      dispatch(fetchProducts({ category: product.category, limit: 4 }));
    }
  }, [product?.category, dispatch]);

  const relatedProducts = products.filter((p) => p.id !== id).slice(0, 4);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    const result = await dispatch(addToCart({ productId: id!, quantity }));
    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart!');
      dispatch(fetchCart()); // re-fetch to guarantee sync
    } else {
      toast.error((result.payload as string) || 'Failed to add to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    if (isInWishlist) {
      const result = await dispatch(removeFromWishlist(id!));
      if (removeFromWishlist.fulfilled.match(result)) {
        toast.success('Removed from wishlist');
        dispatch(fetchWishlist()); // re-fetch to guarantee sync
      }
    } else {
      const result = await dispatch(addToWishlist(id!));
      if (addToWishlist.fulfilled.match(result)) {
        toast.success('Added to wishlist!');
        dispatch(fetchWishlist()); // re-fetch to guarantee sync
      }
    }
  };

  if (isLoadingDetail || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50 pt-24">
        <LoadingSpinner size="lg" text="Loading product..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="container-custom">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-earth-500 hover:text-earth-700 mb-8 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square bg-earth-100 rounded-sm overflow-hidden mb-4 relative group">
              <img
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.glbAsset && (
                <button
                  onClick={() => setShowAR(true)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 bg-earth-900/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-sm text-sm font-medium hover:bg-earth-800 transition-colors shadow-lg"
                >
                  <Box size={16} />
                  View in 3D
                </button>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${
                      i === selectedImage
                        ? 'border-gold-500 shadow-md'
                        : 'border-earth-200 hover:border-earth-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="text-earth-500 uppercase tracking-widest text-xs font-semibold mb-2">
              {product.category}
            </span>

            <h1 className="font-serif text-3xl md:text-4xl text-earth-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.ratings.average)
                        ? 'text-gold-500 fill-gold-500'
                        : 'text-earth-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-earth-500">
                {product.ratings.average} ({product.ratings.count} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-serif text-earth-900 mb-6">
              {product.formattedPrice}
            </p>

            {/* Description */}
            <p className="text-earth-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-8">
              {product.stock > 0 ? (
                <>
                  <Check size={16} className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-earth-300 rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-earth-600 hover:text-earth-900 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-earth-900 font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 text-earth-600 hover:text-earth-900 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </Button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`flex items-center justify-center gap-2 py-3 border rounded-sm text-sm font-medium transition-all ${
                isInWishlist
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-earth-300 text-earth-600 hover:border-earth-400 hover:text-earth-800'
              }`}
            >
              <Heart size={16} className={isInWishlist ? 'fill-red-500' : ''} />
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Artisan Section */}
            {product.artisan && (
              <div className="mt-8 pt-6 border-t border-earth-200">
                <p className="text-xs text-earth-400 uppercase tracking-widest mb-3">Crafted by</p>
                <Link
                  to={`/artisans/${product.artisan.id}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-earth-100 shrink-0">
                    {product.artisan.profileImage ? (
                      <img
                        src={product.artisan.profileImage}
                        alt={product.artisan.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-earth-500 font-serif">
                        {product.artisan.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-earth-900 group-hover:text-gold-600 transition-colors">
                      {product.artisan.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-earth-500">
                      <MapPin size={10} />
                      <span>{product.artisan.location.city}, {product.artisan.location.state}</span>
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-gold-500 font-medium group-hover:translate-x-1 transition-transform">
                    View Profile →
                  </span>
                </Link>
              </div>
            )}

            {/* Details */}
            <div className="mt-10 pt-8 border-t border-earth-200 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-earth-500">Category</span>
                <span className="text-earth-800 font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-earth-500">Handcrafted</span>
                <span className="text-earth-800 font-medium">Yes — by skilled artisans</span>
              </div>
              {product.glbAsset && (
                <div className="flex justify-between text-sm">
                  <span className="text-earth-500">AR Preview</span>
                  <span className="text-gold-600 font-medium">Available</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24"
          >
            <h2 className="text-2xl md:text-3xl font-serif text-earth-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* AR Modal */}
      {product.glbAsset && (
        <ARModal
          isOpen={showAR}
          onClose={() => setShowAR(false)}
          glbAsset={product.glbAsset}
          productName={product.name}
        />
      )}
    </div>
  );
}
