import { motion, AnimatePresence } from 'framer-motion';
import { X, Box } from 'lucide-react';
import '@google/model-viewer';

// Add type definition for model-viewer since it's a custom element
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                src?: string;
                'ios-src'?: string;
                poster?: string;
                alt?: string;
                'shadow-intensity'?: string;
                'camera-controls'?: boolean;
                'auto-rotate'?: boolean;
                ar?: boolean;
                'ar-modes'?: string;
                reveal?: string;
            }, HTMLElement>;
        }
    }
}

interface ARModalProps {
    isOpen: boolean;
    onClose: () => void;
    glbAsset: string;
    productName: string;
}

export function ARModal({ isOpen, onClose, glbAsset, productName }: ARModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        {/* Modal Content */}
                        <div className="bg-white w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl relative overflow-hidden flex flex-col pointer-events-auto">

                            {/* Header */}
                            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent text-white">
                                <h3 className="font-serif text-xl font-medium drop-shadow-md">{productName}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* AR Viewer */}
                            <div className="w-full h-full bg-earth-50 relative">
                                <model-viewer
                                    src={glbAsset}
                                    ios-src="" // Add usdz if available in future
                                    poster="" // Could add a loading poster
                                    alt={`3D model of ${productName}`}
                                    shadow-intensity="1"
                                    camera-controls
                                    auto-rotate
                                    ar
                                    ar-modes="webxr scene-viewer quick-look"
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <button slot="ar-button" className="absolute bottom-6 right-6 px-6 py-3 bg-earth-900 text-white rounded-full font-medium shadow-lg flex items-center gap-2 hover:bg-earth-800 transition-colors z-20">
                                        <Box className="w-5 h-5" />
                                        1space
                                    </button>
                                </model-viewer>
                            </div>

                            {/* Instructions */}
                            <div className="absolute bottom-6 left-6 z-10 pointer-events-none hidden md:block">
                                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm text-xs text-earth-800 font-medium">
                                    Use mouse to rotate • Scroll to zoom
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
