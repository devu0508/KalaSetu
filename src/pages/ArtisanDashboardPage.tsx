import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Edit3, Trash2, X, Save, BarChart3, Boxes, IndianRupee } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearArtisanProductError,
  clearArtisanProductSuccess,
} from '../store/slices/artisanProductSlice';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  images: string;
  stock: string;
}

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category: '',
  images: '',
  stock: '0',
};

const CATEGORIES = [
  'Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Metalwork',
  'Painting', 'Leather', 'Bamboo', 'Stone Carving', 'Other',
];

export default function ArtisanDashboardPage() {
  const dispatch = useAppDispatch();
  const { products, isLoading, error, successMessage } = useAppSelector((s) => s.artisanProducts);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearArtisanProductSuccess());
    }
    if (error) {
      toast.error(error);
      dispatch(clearArtisanProductError());
    }
  }, [successMessage, error, dispatch]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: product.category,
      images: (product.images || []).join(', '),
      stock: String(product.stock || 0),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      images: form.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      stock: parseInt(form.stock, 10) || 0,
    };

    if (editingId) {
      await dispatch(updateProduct({ id: editingId, data }));
    } else {
      await dispatch(createProduct(data));
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteProduct(id));
    setDeleteConfirmId(null);
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50 pt-24">
        <LoadingSpinner size="lg" text="Loading your products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-28 pb-16">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-earth-900">Artisan Dashboard</h1>
              <p className="text-earth-500 text-sm mt-1">Manage your product listings</p>
            </div>
            <Button variant="secondary" onClick={openCreateModal} className="flex items-center gap-2">
              <Plus size={18} />
              Add Product
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Products', value: totalProducts, icon: Package, color: 'from-earth-700 to-earth-800' },
              { label: 'Total Stock', value: totalStock, icon: Boxes, color: 'from-gold-500 to-gold-600' },
              { label: 'Inventory Value', value: `₹${totalValue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-earth-600 to-earth-700' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2 }}
                className="bg-white rounded-lg border border-earth-100 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-earth-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-serif font-bold text-earth-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-lg border border-earth-100"
            >
              <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-earth-400" />
              </div>
              <h3 className="font-serif text-xl text-earth-700 mb-2">No products yet</h3>
              <p className="text-earth-500 text-sm mb-6 max-w-md mx-auto">
                Start adding your handcrafted products to reach customers across India.
              </p>
              <Button variant="secondary" onClick={openCreateModal} className="flex items-center gap-2 mx-auto">
                <Plus size={18} />
                Add Your First Product
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-lg border border-earth-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-earth-100 overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={40} className="text-earth-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <button
                        onClick={() => openEditModal(product)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-earth-600 hover:text-gold-600 hover:bg-white transition-all shadow-sm"
                        aria-label="Edit product"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-earth-600 hover:text-red-600 hover:bg-white transition-all shadow-sm"
                        aria-label="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif font-semibold text-earth-900 text-sm line-clamp-1">{product.name}</h3>
                      <span className="text-xs bg-earth-100 text-earth-600 px-2 py-0.5 rounded-full shrink-0">
                        {product.category}
                      </span>
                    </div>
                    {product.description && (
                      <p className="text-earth-500 text-xs line-clamp-2 mb-3">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-earth-50">
                      <span className="font-serif font-bold text-earth-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-earth-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="font-serif text-xl text-earth-900">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-earth-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-earth-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                  label="Product Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Handwoven Pashmina Shawl"
                />

                <div className="w-full">
                  <label className="block text-sm font-medium text-earth-700 mb-1.5 tracking-wide">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    placeholder="Describe your product, materials used, dimensions..."
                    className="w-full rounded-sm border border-earth-300 bg-white px-4 py-3 text-earth-900 text-sm placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all duration-200 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price (₹)"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    placeholder="2400"
                  />
                  <Input
                    label="Stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    min="0"
                    placeholder="10"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-earth-700 mb-1.5 tracking-wide">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                    className="w-full rounded-sm border border-earth-300 bg-white px-4 py-3 text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Image URLs (comma-separated)"
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://..."
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    {isLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full"
            >
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="font-serif text-xl text-earth-900 mb-2">Delete Product?</h3>
                <p className="text-earth-500 text-sm mb-6">
                  This action cannot be undone. The product will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setDeleteConfirmId(null)} className="flex-1">
                    Cancel
                  </Button>
                  <button
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-sm font-medium hover:bg-red-700 transition-colors text-sm"
                  >
                    {isLoading ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
