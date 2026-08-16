import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cart, isLoading } = useAppSelector((s) => s.cart);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const result = await dispatch(updateCartItem({ productId, quantity }));
    if (updateCartItem.rejected.match(result)) {
      toast.error((result.payload as string) || 'Failed to update');
    }
  };

  const handleRemoveItem = async (productId: string, name: string) => {
    const result = await dispatch(removeFromCart(productId));
    if (removeFromCart.fulfilled.match(result)) {
      toast.success(`${name} removed from cart`);
    }
  };

  const handleClearCart = async () => {
    const result = await dispatch(clearCart());
    if (clearCart.fulfilled.match(result)) {
      toast.success('Cart cleared');
    }
  };

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString('en-IN')}`;

  if (isLoading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50 pt-24">
        <LoadingSpinner size="lg" text="Loading your cart..." />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-earth-50 pt-28 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif text-earth-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-earth-500 text-sm mb-10">
            {isEmpty
              ? 'Your cart is empty'
              : `${cart!.items.length} item${cart!.items.length > 1 ? 's' : ''} in your cart`}
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
              <ShoppingBag size={36} className="text-earth-400" />
            </div>
            <h2 className="text-xl font-serif text-earth-700 mb-3">Your cart is empty</h2>
            <p className="text-earth-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any handcrafted treasures yet. Explore our collection to find something special.
            </p>
            <Link to="/products">
              <Button variant="primary" size="md" className="group">
                Browse Collection
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart!.items.map((item, index) => {
                const product = item.productId;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="bg-white rounded-sm border border-earth-100 shadow-sm p-4 md:p-6 flex gap-4 md:gap-6 group"
                  >
                    {/* Product Image */}
                    <Link
                      to={`/products/${product.id}`}
                      className="shrink-0 w-24 h-24 md:w-32 md:h-32 bg-earth-100 rounded-sm overflow-hidden"
                    >
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          to={`/products/${product.id}`}
                          className="font-serif text-lg text-earth-900 hover:text-gold-600 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-earth-500 uppercase tracking-wider mt-0.5">
                          {product.category}
                        </p>
                      </div>

                      <div className="flex items-end justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-earth-200 rounded-sm">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(product.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 text-earth-500 hover:text-earth-800 disabled:opacity-30 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-earth-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(product.id, item.quantity + 1)
                            }
                            className="p-2 text-earth-500 hover:text-earth-800 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price + Remove */}
                        <div className="flex items-center gap-4">
                          <p className="font-serif text-lg text-earth-900">
                            {formatPrice(item.priceAtAdd * item.quantity)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(product.id, product.name)}
                            className="p-2 text-earth-400 hover:text-red-500 transition-colors"
                            title="Remove item"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Clear Cart */}
              <div className="flex justify-between items-center pt-4">
                <Link
                  to="/products"
                  className="text-sm text-earth-500 hover:text-earth-700 font-medium transition-colors flex items-center gap-1"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-sm border border-earth-100 shadow-sm p-6 sticky top-28"
              >
                <h2 className="font-serif text-xl text-earth-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  {cart!.items.map((item) => (
                    <div key={item.productId.id} className="flex justify-between text-sm">
                      <span className="text-earth-600 truncate max-w-[60%]">
                        {item.productId.name} × {item.quantity}
                      </span>
                      <span className="text-earth-800 font-medium">
                        {formatPrice(item.priceAtAdd * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-earth-100 pt-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-earth-500">Subtotal</span>
                    <span className="text-earth-800 font-medium">
                      {formatPrice(cart!.total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-earth-500">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="border-t border-earth-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-serif text-lg text-earth-900">Total</span>
                    <span className="font-serif text-lg text-earth-900">
                      {formatPrice(cart!.total)}
                    </span>
                  </div>
                </div>

                <Button variant="secondary" size="lg" className="w-full">
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-earth-400 text-center mt-4">
                  Taxes calculated at checkout
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
