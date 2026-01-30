import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { ARModal } from './ARModal';
import { Box } from 'lucide-react';

interface ProductCardProps {
    id: number;
    name: string;
    price: string;
    image: string;
    category: string;
    glbAsset?: string;
}

export function ProductCard({ name, price, image, category, glbAsset }: ProductCardProps) {
    const [showAR, setShowAR] = useState(false);

    return (
        <>
            <motion.div
                className="group relative bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative aspect-[3/4] overflow-hidden bg-earth-100">
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {glbAsset ? (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setShowAR(true)}
                                className="flex items-center gap-2"
                            >
                                <Box className="w-4 h-4" />
                                View in your room
                            </Button>
                        ) : (
                            <Button size="sm" variant="secondary">View Details</Button>
                        )}
                    </div>
                </div>

                <div className="p-4 text-center">
                    <p className="text-xs text-earth-500 uppercase tracking-wider mb-1">{category}</p>
                    <h3 className="font-serif text-lg text-earth-900 mb-1">{name}</h3>
                    <p className="text-earth-700 font-medium">{price}</p>
                </div>
            </motion.div>

            {glbAsset && (
                <ARModal
                    isOpen={showAR}
                    onClose={() => setShowAR(false)}
                    glbAsset={glbAsset}
                    productName={name}
                />
            )}
        </>
    );
}
