import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Package } from 'lucide-react';
import type { Artisan } from '../types';

interface ArtisanCardProps {
  artisan: Artisan;
  index?: number;
}

export function ArtisanCard({ artisan, index = 0 }: ArtisanCardProps) {
  const yearsActive = new Date().getFullYear() - artisan.since;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/artisans/${artisan.id}`} className="block group">
        <div className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-earth-100 hover:border-earth-200">
          {/* Cover / Profile Image */}
          <div className="relative h-52 bg-earth-200 overflow-hidden">
            {artisan.coverImage ? (
              <img
                src={artisan.coverImage}
                alt={artisan.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-earth-200 to-earth-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Featured badge */}
            {artisan.featured && (
              <div className="absolute top-3 left-3 bg-gold-500 text-earth-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Featured
              </div>
            )}

            {/* Craft badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-earth-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {artisan.craft}
            </div>

            {/* Profile Image */}
            <div className="absolute -bottom-8 left-5">
              <div className="w-16 h-16 rounded-full border-3 border-white shadow-lg overflow-hidden bg-earth-200">
                {artisan.profileImage ? (
                  <img
                    src={artisan.profileImage}
                    alt={artisan.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-earth-300 text-earth-600 font-serif text-xl">
                    {artisan.name[0]}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-11 pb-5 px-5">
            <h3 className="font-serif text-xl text-earth-900 group-hover:text-gold-600 transition-colors mb-0.5">
              {artisan.name}
            </h3>

            <div className="flex items-center gap-1 text-earth-500 text-xs mb-3">
              <MapPin size={11} />
              <span>{artisan.location.city}, {artisan.location.state}</span>
            </div>

            <p className="text-earth-600 text-sm leading-relaxed line-clamp-2 mb-4">
              {artisan.bio}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-4 border-t border-earth-100">
              <div className="flex items-center gap-1.5 text-xs text-earth-500">
                <Calendar size={12} className="text-gold-500" />
                <span>{yearsActive} yrs active</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-earth-500">
                <Package size={12} className="text-gold-500" />
                <span>{artisan.products?.length ?? 0} products</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
