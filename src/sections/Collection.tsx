import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';

const products = [
    { id: 1, name: "Terracotta Vase", price: "₹2,400", category: "Pottery", image: "https://images.unsplash.com/photo-1578749556935-ef3893eb8d85?auto=format&fit=crop&q=80&w=800", glbAsset: "/glb_assets/vase.glb" },
    { id: 2, name: "Woven Bamboo Basket", price: "₹1,800", category: "Weaving", image: "https://images.unsplash.com/photo-1595163623728-98e354923f54?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Brass Oil Lamp", price: "₹3,200", category: "Metalwork", image: "https://images.unsplash.com/photo-1615461971485-9e3d93b45502?auto=format&fit=crop&q=80&w=800", glbAsset: "/glb_assets/owl_metal_sculpture.glb" },
    { id: 4, name: "Hand-Block Print Saree", price: "₹8,500", category: "Textile", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800" },
    { id: 5, name: "Sandalwood Carving", price: "₹12,000", category: "Woodwork", image: "https://images.unsplash.com/photo-1610729790676-e8d9d44cf617?auto=format&fit=crop&q=80&w=800", glbAsset: "/glb_assets/christus_rex_christ_the_king.glb" },
    { id: 6, name: "Kashmiri Shawl", price: "₹15,000", category: "Textile", image: "https://images.unsplash.com/photo-1576487248866-993d50849925?auto=format&fit=crop&q=80&w=800" },
];

export function Collection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section id="collection" ref={ref} className="py-24 bg-earth-50 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-earth-100 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2" />

            <div className="container-custom">
                <div className="text-center mb-16">
                    <motion.span
                        className="text-earth-500 uppercase tracking-widest text-sm font-semibold"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Curated Excellence
                    </motion.span>
                    <motion.h2
                        className="text-4xl md:text-5xl font-serif text-earth-900 mt-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        The Collection
                    </motion.h2>
                </div>

                <motion.div style={{ y }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </motion.div>
            </div>

        </section>
    );
}
