import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

// Featured products for the landing page (static showcase)
const products: Product[] = [
    { id: '1', name: "Terracotta Vase", description: "A beautiful hand-thrown terracotta vase", price: 2400, formattedPrice: "₹2,400", category: "Pottery", images: ["/uploads/products/terracota%20vase.jpg"], image: "/uploads/products/terracota%20vase.jpg", glbAsset: "/glb_assets/vase.glb", stock: 10, ratings: { average: 4.8, count: 42 }, createdAt: '' },
    { id: '2', name: "Woven Bamboo Basket", description: "Handwoven bamboo basket by tribal artisans", price: 1800, formattedPrice: "₹1,800", category: "Weaving", images: ["/uploads/products/bamboo.jpg"], image: "/uploads/products/bamboo.jpg", glbAsset: '', stock: 5, ratings: { average: 4.6, count: 28 }, createdAt: '' },
    { id: '3', name: "Brass Oil Lamp", description: "Intricately carved brass oil lamp", price: 3200, formattedPrice: "₹3,200", category: "Metalwork", images: ["/uploads/products/brass%20oil%20lamp.webp"], image: "/uploads/products/brass%20oil%20lamp.webp", glbAsset: "/glb_assets/owl_metal_sculpture.glb", stock: 8, ratings: { average: 4.9, count: 61 }, createdAt: '' },
    { id: '4', name: "Hand-Block Print Saree", description: "Authentic hand-block printed saree from Rajasthan", price: 8500, formattedPrice: "₹8,500", category: "Textile", images: ["/uploads/products/hand%20woven%20saree.jpg"], image: "/uploads/products/hand%20woven%20saree.jpg", glbAsset: '', stock: 3, ratings: { average: 4.7, count: 19 }, createdAt: '' },
    { id: '5', name: "Sandalwood Carving", description: "Exquisite sandalwood sculpture by master carvers", price: 12000, formattedPrice: "₹12,000", category: "Woodwork", images: ["/uploads/products/sandalwood%20carving.jpeg"], image: "/uploads/products/sandalwood%20carving.jpeg", glbAsset: "/glb_assets/christus_rex_christ_the_king.glb", stock: 2, ratings: { average: 5.0, count: 14 }, createdAt: '' },
    { id: '6', name: "Kashmiri Shawl", description: "Pure Pashmina Kashmiri shawl, hand embroidered", price: 15000, formattedPrice: "₹15,000", category: "Textile", images: ["/uploads/products/kashmiri%20shawl.jpg"], image: "/uploads/products/kashmiri%20shawl.jpg", glbAsset: '', stock: 6, ratings: { average: 4.8, count: 33 }, createdAt: '' },
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
                        <ProductCard key={product.id} product={product} />
                    ))}
                </motion.div>

                <motion.div
                    className="text-center mt-14"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-earth-900 text-earth-900 font-semibold text-sm uppercase tracking-widest hover:bg-earth-900 hover:text-earth-50 transition-all duration-300 rounded-sm"
                    >
                        View Full Collection
                    </Link>
                </motion.div>
            </div>

        </section>
    );
}
