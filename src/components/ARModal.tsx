import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Box, Camera } from 'lucide-react';
import '@google/model-viewer';
import toast from 'react-hot-toast';

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
    const viewerRef = useRef<any>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [flash, setFlash] = useState(false);

    const handleCapturePhoto = async () => {
        if (!viewerRef.current) return;
        try {
            setIsCapturing(true);
            setFlash(true);
            setTimeout(() => setFlash(false), 200);

            const blob = await viewerRef.current.toBlob({ idealAspect: true });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${productName.toLowerCase().replace(/\s+/g, '-')}-3d-photo.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('3D photo captured & downloaded!', { icon: '📸' });
        } catch (err) {
            console.error('Failed to capture photo:', err);
            toast.error('Could not capture photo from 3D viewer');
        } finally {
            setIsCapturing(false);
        }
    };

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

                            {/* Camera Flash effect */}
                            {flash && (
                                <div className="absolute inset-0 bg-white z-30 pointer-events-none transition-opacity duration-200" />
                            )}

                            {/* Header */}
                            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent text-white">
                                <div>
                                    <h3 className="font-serif text-xl font-medium drop-shadow-md">{productName}</h3>
                                    <p className="text-xs text-white/80">Interactive 3D / Augmented Reality</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCapturePhoto}
                                        disabled={isCapturing}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors text-xs font-medium"
                                        title="Capture high-resolution 3D photo"
                                    >
                                        <Camera className="w-4 h-4" />
                                        <span>Take Photo</span>
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* AR Viewer */}
                            <div className="w-full h-full bg-earth-50 relative">
                                <model-viewer
                                    ref={viewerRef}
                                    src={glbAsset}
                                    ios-src=""
                                    poster=""
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
                                        View in Your Space
                                    </button>
                                </model-viewer>
                            </div>

                            {/* Controls Overlay Bottom */}
                            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 pointer-events-auto">
                                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm text-xs text-earth-800 font-medium hidden md:block">
                                    Rotate: Drag • Zoom: Scroll
                                </div>
                                <button
                                    onClick={handleCapturePhoto}
                                    disabled={isCapturing}
                                    className="md:hidden flex items-center gap-1.5 px-4 py-2.5 bg-earth-900 text-white rounded-full shadow-lg text-xs font-medium"
                                >
                                    <Camera className="w-4 h-4" />
                                    Capture Photo
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
