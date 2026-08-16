import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, setFilters } from '../store/slices/productSlice';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const categories = ['All', 'Pottery', 'Weaving', 'Metalwork', 'Textile', 'Woodwork'];
const sortOptions = [
  { label: 'Newest', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, pagination, isLoading, filters } = useAppSelector((s) => s.products);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleCategoryChange = (category: string) => {
    dispatch(setFilters({ category: category === 'All' ? '' : category, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchInput, page: 1 }));
  };

  const handleSortChange = (sort: string) => {
    dispatch(setFilters({ sort, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchInput('');
    dispatch(setFilters({ search: '', page: 1 }));
  };

  return (
    <div className="min-h-screen bg-earth-50 pt-28 pb-16">
      {/* Header */}
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-earth-500 uppercase tracking-widest text-sm font-semibold">
            Explore
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-earth-900 mt-2 mb-4">
            Our Collection
          </h1>
          <p className="text-earth-600 max-w-2xl mx-auto">
            Each piece is handcrafted with love by India's finest artisans, carrying centuries of tradition.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10"
        >
          {/* Search */}
          <div className="flex gap-3 mb-6">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white border border-earth-200 rounded-sm text-earth-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
                >
                  <X size={16} />
                </button>
              )}
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-earth-200 rounded-sm text-earth-700 hover:border-gold-500 transition-colors text-sm font-medium md:hidden"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          {/* Category Tabs + Sort — Desktop */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => {
                const isActive = (cat === 'All' && !filters.category) || filters.category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-5 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-earth-900 text-earth-50 shadow-md'
                        : 'bg-white text-earth-600 border border-earth-200 hover:border-earth-400'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 bg-white border border-earth-200 rounded-sm text-sm text-earth-700 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 p-4 bg-white border border-earth-200 rounded-sm space-y-4"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-earth-500 mb-2 font-semibold">Category</p>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => {
                    const isActive = (cat === 'All' && !filters.category) || filters.category === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-4 py-1.5 rounded-sm text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-earth-900 text-earth-50'
                            : 'bg-earth-100 text-earth-600'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-earth-500 mb-2 font-semibold">Sort By</p>
                <select
                  value={filters.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 bg-earth-50 border border-earth-200 rounded-sm text-sm"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Info */}
        {pagination && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-earth-500">
              Showing{' '}
              <span className="font-semibold text-earth-700">
                {products.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-earth-700">
                {pagination.total}
              </span>{' '}
              products
            </p>
          </div>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading collection..." />
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🏺</div>
            <h3 className="text-xl font-serif text-earth-700 mb-2">No products found</h3>
            <p className="text-earth-500 mb-6">Try adjusting your search or filters.</p>
            <button
              onClick={() => {
                clearSearch();
                dispatch(setFilters({ category: '', sort: '', page: 1 }));
              }}
              className="text-gold-500 hover:text-gold-600 font-medium text-sm"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-sm border border-earth-200 text-earth-600 hover:border-earth-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-sm text-sm font-medium transition-all ${
                  page === pagination.page
                    ? 'bg-earth-900 text-earth-50 shadow-md'
                    : 'border border-earth-200 text-earth-600 hover:border-earth-400'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-2 rounded-sm border border-earth-200 text-earth-600 hover:border-earth-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
