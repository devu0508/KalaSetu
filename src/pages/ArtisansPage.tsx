import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Star } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchArtisans } from '../store/slices/artisanSlice';
import { ArtisanCard } from '../components/ArtisanCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const crafts = ['All', 'Pottery', 'Weaving', 'Metalwork', 'Textile', 'Woodwork'];

export default function ArtisansPage() {
  const dispatch = useAppDispatch();
  const { artisans, pagination, isLoading } = useAppSelector((s) => s.artisans);
  const [selectedCraft, setSelectedCraft] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(
      fetchArtisans({
        craft: selectedCraft || undefined,
        featured: showFeaturedOnly ? true : undefined,
        limit: 20,
      })
    );
  }, [dispatch, selectedCraft, showFeaturedOnly]);

  const displayed = artisans.filter((a) =>
    searchQuery
      ? a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.state.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-earth-50 pt-28 pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-earth-900 mb-14">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-950/80 to-earth-900/60" />
        <div className="relative container-custom py-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-400 uppercase tracking-[0.3em] text-xs font-semibold mb-4 block"
          >
            The Hands Behind the Art
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl text-white mb-6"
          >
            Meet Our Artisans
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-earth-300 max-w-2xl mx-auto text-lg"
          >
            Every KalaSetu piece is made by a master craftsperson with a lifetime of skill
            and a story worth telling. Meet the hands behind the heritage.
          </motion.p>
        </div>
      </div>

      <div className="container-custom">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name, craft or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white border border-earth-200 rounded-sm text-sm text-earth-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Craft Tabs + Featured Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {crafts.map((craft) => {
                const isActive =
                  (craft === 'All' && !selectedCraft) || selectedCraft === craft;
                return (
                  <button
                    key={craft}
                    onClick={() => setSelectedCraft(craft === 'All' ? '' : craft)}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-earth-900 text-earth-50 shadow-md'
                        : 'bg-white text-earth-600 border border-earth-200 hover:border-earth-400'
                    }`}
                  >
                    {craft}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowFeaturedOnly((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium border transition-all ${
                showFeaturedOnly
                  ? 'bg-gold-500 border-gold-500 text-earth-900'
                  : 'bg-white border-earth-200 text-earth-600 hover:border-gold-400'
              }`}
            >
              <Star size={14} className={showFeaturedOnly ? 'fill-earth-900' : ''} />
              Featured Only
            </button>
          </div>
        </motion.div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-earth-500 mb-6">
            Showing{' '}
            <span className="font-semibold text-earth-700">{displayed.length}</span>{' '}
            artisan{displayed.length !== 1 ? 's' : ''}
            {pagination && ` of ${pagination.total} total`}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <LoadingSpinner size="lg" text="Loading artisans..." />
          </div>
        ) : displayed.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-serif text-earth-700 mb-2">No artisans found</h3>
            <p className="text-earth-500 mb-6">Try adjusting your filters or search.</p>
            <button
              onClick={() => {
                setSelectedCraft('');
                setShowFeaturedOnly(false);
                setSearchQuery('');
              }}
              className="text-gold-500 hover:text-gold-600 font-medium text-sm"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((artisan, index) => (
              <ArtisanCard key={artisan.id} artisan={artisan} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
