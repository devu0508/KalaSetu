import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Menu, ShoppingBag, X } from 'lucide-react';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [animationDone, setAnimationDone] = useState(false);

    const textColorClass = "text-earth-100";
    const hoverColorClass = "hover:text-gold-500";

    return (
        <motion.nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 py-6 transition-all duration-700 ease-out",
                animationDone
                    ? "bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg"
                    : "bg-transparent"
            )}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => setAnimationDone(true)}
        >
            <div className="container-custom flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <a href="#" className={cn("font-serif text-2xl font-bold tracking-widest uppercase transition-colors", textColorClass)}>
                        KalaSetu
                    </a>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {['The Process', 'Our Story', 'Collection', 'Artisans'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                            className={cn("font-medium tracking-wide text-sm uppercase transition-colors", textColorClass, hoverColorClass)}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button className={cn("relative p-2 transition-colors", textColorClass, hoverColorClass)}>
                        <ShoppingBag size={24} />
                        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-gold-500 text-[10px] font-bold flex items-center justify-center text-white">0</span>
                    </button>

                    <button
                        className={cn("md:hidden p-2 transition-colors", textColorClass)}
                        onClick={() => setIsMobileMenuOpen(prev => !prev)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
                className={cn(
                    "fixed inset-0 bg-earth-900 z-40 flex flex-col items-center justify-center gap-8 md:hidden",
                    isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
                )}
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? "0%" : "-100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {['The Process', 'Our Story', 'Collection', 'Artisans'].map((item) => (
                    <a
                        key={item}
                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                        className="font-serif text-3xl text-earth-100 hover:text-gold-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {item}
                    </a>
                ))}
            </motion.div>
        </motion.nav>
    );
}

