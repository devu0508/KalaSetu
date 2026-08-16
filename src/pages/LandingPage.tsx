import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Palette, ArrowRight, Sparkles, Users, Globe, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-earth-950 text-earth-100 overflow-hidden">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-earth-950/60 via-earth-950/80 to-earth-950" />

        {/* Decorative Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-500/6 rounded-full blur-[100px]" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-gold-500 tracking-[0.25em] text-xs md:text-sm font-medium uppercase mb-6 border border-gold-500/30 px-4 py-1.5 rounded-full">
              Handcrafted with Soul
            </span>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.95] mb-8">
              <span className="text-earth-100">Kala</span>
              <span className="text-gold-500">Setu</span>
            </h1>

            <p className="text-lg md:text-xl text-earth-300 max-w-2xl mx-auto leading-relaxed mb-4">
              Bridging the gap between India's timeless artisan heritage and the modern world.
            </p>
            <p className="text-sm text-earth-500 max-w-lg mx-auto mb-12">
              A marketplace where master craftspeople showcase centuries-old traditions,
              and conscious buyers discover authentic handmade treasures.
            </p>
          </motion.div>

          {/* ── Role-Based CTAs ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            {/* Customer CTA */}
            <Link
              to="/auth"
              state={{ preferredRole: 'customer' }}
              className="group relative w-full sm:w-auto"
            >
              <div className="flex items-center gap-3 bg-white/[0.07] backdrop-blur-xl border border-white/10 hover:border-gold-500/40 rounded-lg px-8 py-4 transition-all duration-300 hover:bg-white/[0.12] hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-gold-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-earth-100 text-sm">Shop as Customer</p>
                  <p className="text-xs text-earth-500">Browse & buy handcrafted goods</p>
                </div>
                <ArrowRight size={16} className="text-earth-500 group-hover:text-gold-500 group-hover:translate-x-1 transition-all ml-2" />
              </div>
            </Link>

            {/* Artisan CTA */}
            <Link
              to="/auth"
              state={{ preferredRole: 'artisan' }}
              className="group relative w-full sm:w-auto"
            >
              <div className="flex items-center gap-3 bg-gold-500/10 backdrop-blur-xl border border-gold-500/25 hover:border-gold-500/50 rounded-lg px-8 py-4 transition-all duration-300 hover:bg-gold-500/15 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <Palette size={18} className="text-gold-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gold-400 text-sm">Join as Artisan</p>
                  <p className="text-xs text-earth-400">Sell your handmade creations</p>
                </div>
                <ArrowRight size={16} className="text-gold-600 group-hover:text-gold-400 group-hover:translate-x-1 transition-all ml-2" />
              </div>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div className="w-5 h-8 border-2 border-earth-600 rounded-full flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1 h-1.5 bg-gold-500 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-earth-950 via-earth-900 to-earth-950" />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-gold-500 tracking-[0.2em] text-xs uppercase font-medium">Why KalaSetu</span>
            <h2 className="text-3xl md:text-5xl font-serif mt-3 text-earth-100">
              The Art Bridge
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Authentic Craft',
                desc: 'Every product is handmade by verified artisans using centuries-old techniques.',
              },
              {
                icon: Users,
                title: 'Direct Impact',
                desc: 'Your purchase directly supports rural artisan families and their communities.',
              },
              {
                icon: Globe,
                title: 'Cultural Heritage',
                desc: 'Preserving India\'s intangible cultural heritage — one craft at a time.',
              },
              {
                icon: Shield,
                title: 'Quality Assured',
                desc: 'Each piece is curated for quality, authenticity, and artisanal excellence.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-lg p-6 hover:bg-white/[0.07] hover:border-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center mb-4">
                  <feature.icon size={18} className="text-gold-500" />
                </div>
                <h3 className="font-serif text-lg text-earth-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-earth-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-earth-950" />

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold-500 tracking-[0.2em] text-xs uppercase font-medium">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-serif mt-3 text-earth-100">Two Paths, One Mission</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Path */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-earth-800 flex items-center justify-center">
                  <ShoppingBag size={20} className="text-gold-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-earth-100">For Customers</h3>
                  <p className="text-xs text-earth-500">Discover handcrafted treasures</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  'Create an account or sign in with Google',
                  'Browse curated collections from master artisans',
                  'Add to cart and wishlist with one click',
                  'Experience AR previews for select products',
                  'Support artisan communities with every purchase',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500/15 text-gold-500 text-xs font-semibold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-earth-300">{step}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/auth"
                state={{ preferredRole: 'customer' }}
                className="mt-8 inline-flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 font-medium transition-colors"
              >
                Start Shopping <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Artisan Path */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gold-500/[0.04] border border-gold-500/15 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gold-500/15 flex items-center justify-center">
                  <Palette size={20} className="text-gold-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gold-400">For Artisans</h3>
                  <p className="text-xs text-earth-500">Showcase your craft to the world</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  'Register as an artisan with your craft details',
                  'Access your personal artisan dashboard',
                  'Add products with images, pricing and stock info',
                  'Your creations go live for all customers to see',
                  'Use AI Business Helper for marketing & insights',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-500/20 text-gold-500 text-xs font-semibold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-earth-300">{step}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/auth"
                state={{ preferredRole: 'artisan' }}
                className="mt-8 inline-flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400 font-medium transition-colors"
              >
                Start Selling <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ──────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950 to-earth-900" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center max-w-2xl mx-auto px-4"
        >
          <h2 className="text-3xl md:text-5xl font-serif mb-4 text-earth-100">
            Ready to begin?
          </h2>
          <p className="text-earth-400 mb-8">
            Join thousands of artisans and conscious buyers building a more sustainable future for Indian craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="px-8 py-3.5 bg-gold-500 text-earth-950 font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-gold-400 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/explore"
              className="px-8 py-3.5 border border-earth-600 text-earth-300 font-semibold text-sm uppercase tracking-wider rounded-sm hover:border-earth-400 hover:text-earth-100 transition-colors"
            >
              Explore First
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
