import { motion } from 'framer-motion';

export function Story() {
    return (
        <section id="our-story" className="py-24 bg-earth-900 text-earth-100 overflow-hidden">
            <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-serif mb-6 text-gold-500">
                        Preserving <br /> Heritage
                    </h2>
                    <p className="text-lg md:text-xl text-earth-200 leading-relaxed mb-6">
                        KalaSetu, meaning "Art Bridge", was founded with a singular mission: to connect the master artisans of rural India with the world.
                    </p>
                    <p className="text-earth-300 leading-relaxed">
                        In a world of mass production, we champion the slow, the handmade, and the meaningful. Every artifact in our collection carries the fingerprint of its creator and the soul of the soil it came from. By supporting KalaSetu, you are not just buying a product; you are keeping a lineage of craftsmanship alive.
                    </p>
                </motion.div>

                <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="aspect-square bg-earth-800 rounded-sm overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=1200"
                            alt="Artisan working"
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>
                    {/* Decorative border */}
                    <div className="absolute -inset-4 border border-earth-700 -z-10 mt-8 ml-8" />
                </motion.div>

            </div>
        </section>
    );
}
