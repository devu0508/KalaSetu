import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Package, Star, Quote } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchArtisanById, clearSelectedArtisan } from '../store/slices/artisanSlice';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function ArtisanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedArtisan: artisan, isLoadingDetail } = useAppSelector((s) => s.artisans);

  useEffect(() => {
    if (id) dispatch(fetchArtisanById(id));
    return () => { dispatch(clearSelectedArtisan()); };
  }, [id, dispatch]);

  if (isLoadingDetail || !artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50 pt-24">
        <LoadingSpinner size="lg" text="Loading artisan profile..." />
      </div>
    );
  }

  const yearsActive = new Date().getFullYear() - artisan.since;

  return (
    <div className="min-h-screen bg-earth-50 pb-20">
      {/* Cover Image Hero */}
      <div className="relative h-[60vh] min-h-[400px] bg-earth-900">
        {artisan.coverImage && (
          <img
            src={artisan.coverImage}
            alt={artisan.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/90 via-earth-900/40 to-transparent" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 md:left-10 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors z-10"
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>

        {/* Craft badge */}
        <div className="absolute top-24 right-6 md:right-10 bg-gold-500 text-earth-900 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
          {artisan.craft}
        </div>

        {/* Bottom name block */}
        <div className="absolute bottom-0 left-0 right-0 container-custom pb-8">
          <div className="flex items-end gap-6">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-earth-200"
            >
              {artisan.profileImage ? (
                <img
                  src={artisan.profileImage}
                  alt={artisan.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-earth-500 font-serif text-4xl">
                  {artisan.name[0]}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-serif text-3xl md:text-5xl text-white mb-1">
                {artisan.name}
              </h1>
              <div className="flex items-center gap-2 text-earth-300 text-sm">
                <MapPin size={13} />
                <span>{artisan.location.city}, {artisan.location.state}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container-custom pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Story */}
          <div className="lg:col-span-2">
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10"
            >
              <p className="text-xl text-earth-700 leading-relaxed font-light italic border-l-4 border-gold-500 pl-6">
                {artisan.bio}
              </p>
            </motion.div>

            {/* Full Story */}
            {artisan.story && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-sm border border-earth-100 shadow-sm p-8 mb-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Quote size={24} className="text-gold-500" />
                  <h2 className="font-serif text-2xl text-earth-900">Their Story</h2>
                </div>
                <div className="prose prose-earth max-w-none">
                  {artisan.story.split('\n').map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-earth-600 leading-loose mb-4 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Products */}
            {artisan.products && artisan.products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-serif text-2xl md:text-3xl text-earth-900 mb-6">
                  Crafted by {artisan.name.split(' ')[0]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {artisan.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Info card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-sm border border-earth-100 shadow-sm p-6 sticky top-28">
              <h3 className="font-serif text-lg text-earth-900 mb-6">Artisan Profile</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-earth-100 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-earth-500" />
                  </div>
                  <div>
                    <p className="text-xs text-earth-400 uppercase tracking-wide mb-0.5">Location</p>
                    <p className="text-earth-800 font-medium">
                      {artisan.location.city}, {artisan.location.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-earth-100 rounded-full flex items-center justify-center shrink-0">
                    <Star size={16} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-xs text-earth-400 uppercase tracking-wide mb-0.5">Craft</p>
                    <p className="text-earth-800 font-medium">{artisan.craft}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-earth-100 rounded-full flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-earth-500" />
                  </div>
                  <div>
                    <p className="text-xs text-earth-400 uppercase tracking-wide mb-0.5">
                      Practicing Since
                    </p>
                    <p className="text-earth-800 font-medium">
                      {artisan.since} · {yearsActive} years
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-earth-100 rounded-full flex items-center justify-center shrink-0">
                    <Package size={16} className="text-earth-500" />
                  </div>
                  <div>
                    <p className="text-xs text-earth-400 uppercase tracking-wide mb-0.5">
                      Products on KalaSetu
                    </p>
                    <p className="text-earth-800 font-medium">
                      {artisan.products?.length ?? 0} items
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-earth-100">
                <Link
                  to="/artisans"
                  className="text-sm text-earth-500 hover:text-earth-700 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft size={13} />
                  All Artisans
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
