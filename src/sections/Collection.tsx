import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

// Featured products for the landing page (static showcase)
const products: Product[] = [
    { id: '1', name: "Terracotta Vase", description: "A beautiful hand-thrown terracotta vase", price: 2400, formattedPrice: "₹2,400", category: "Pottery", images: ["https://exclusivelane.com/cdn/shop/files/download_0af9ca7f-e3d7-4b20-9741-06b694475426_1024x.jpg?v=1750356209"], image: "https://exclusivelane.com/cdn/shop/files/download_0af9ca7f-e3d7-4b20-9741-06b694475426_1024x.jpg?v=1750356209", glbAsset: "/glb_assets/vase.glb", stock: 10, ratings: { average: 4.8, count: 42 }, createdAt: '' },
    { id: '2', name: "Woven Bamboo Basket", description: "Handwoven bamboo basket by tribal artisans", price: 1800, formattedPrice: "₹1,800", category: "Weaving", images: ["https://u-mercari-images.mercdn.net/photos/m20609866046_2.jpg?1768658149"], image: "https://u-mercari-images.mercdn.net/photos/m20609866046_2.jpg?1768658149", glbAsset: '', stock: 5, ratings: { average: 4.6, count: 28 }, createdAt: '' },
    { id: '3', name: "Brass Oil Lamp", description: "Intricately carved brass oil lamp", price: 3200, formattedPrice: "₹3,200", category: "Metalwork", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo2RJSJfHz182oyRQYTzS2H72qQVm1nAa2KF4KoeyhYCTg8xLt4c3ICJ6I&s=10"], image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo2RJSJfHz182oyRQYTzS2H72qQVm1nAa2KF4KoeyhYCTg8xLt4c3ICJ6I&s=10", glbAsset: "/glb_assets/owl_metal_sculpture.glb", stock: 8, ratings: { average: 4.9, count: 61 }, createdAt: '' },
    { id: '4', name: "Hand-Block Print Saree", description: "Authentic hand-block printed saree from Rajasthan", price: 8500, formattedPrice: "₹8,500", category: "Textile", images: ["https://shobitam.in/cdn/shop/files/RDR523_8.jpg?v=1757264516&width=1800"], image: "https://shobitam.in/cdn/shop/files/RDR523_8.jpg?v=1757264516&width=1800", glbAsset: '', stock: 3, ratings: { average: 4.7, count: 19 }, createdAt: '' },
    { id: '5', name: "Sandalwood Carving", description: "Exquisite sandalwood sculpture by master carvers", price: 12000, formattedPrice: "₹12,000", category: "Woodwork", images: ["https://www.ragaarts.com/cdn/shop/articles/sandal-elephant-blog.jpg?crop=center&height=900&v=1724132793&width=2400"], image: "https://www.ragaarts.com/cdn/shop/articles/sandal-elephant-blog.jpg?crop=center&height=900&v=1724132793&width=2400", glbAsset: "/glb_assets/christus_rex_christ_the_king.glb", stock: 2, ratings: { average: 5.0, count: 14 }, createdAt: '' },
    { id: '6', name: "Kashmiri Shawl", description: "Pure Pashmina Kashmiri shawl, hand embroidered", price: 15000, formattedPrice: "₹15,000", category: "Textile", images: ["https://www.shoppinginkashmir.com/cdn/shop/files/7_2_979fc186-4be3-4d0c-8b3a-bd9a6e58419a.png?v=1746084900&width=823"], image: "https://www.shoppinginkashmir.com/cdn/shop/files/7_2_979fc186-4be3-4d0c-8b3a-bd9a6e58419a.png?v=1746084900&width=823", glbAsset: '', stock: 6, ratings: { average: 4.8, count: 33 }, createdAt: '' },
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
