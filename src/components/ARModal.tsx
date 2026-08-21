import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Box, Camera, Video, VideoOff, Circle } from 'lucide-react';
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
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [isInAR, setIsInAR] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [flash, setFlash] = useState(false);

    // Format recording time as MM:SS
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Listen for AR status changes on model-viewer
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        const handleARStatus = (event: any) => {
            const status = event.detail?.status;
            if (status === 'session-started') {
                setIsInAR(true);
            } else if (status === 'not-presenting' || status === 'failed') {
                setIsInAR(false);
                // Stop recording if AR session ends
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.stop();
                }
            }
        };

        viewer.addEventListener('ar-status', handleARStatus);
        return () => {
            viewer.removeEventListener('ar-status', handleARStatus);
        };
    }, [isOpen]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Capture photo of AR scene
    const handleCapturePhoto = useCallback(async () => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        try {
            // Flash effect
            setFlash(true);
            setTimeout(() => setFlash(false), 300);

            const blob = await viewer.toBlob({ idealAspect: false });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${productName.replace(/\s+/g, '-').toLowerCase()}-ar-capture.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('AR photo captured!', { icon: '📸' });
        } catch (err) {
            console.error('Photo capture failed:', err);
            toast.error('Could not capture AR photo');
        }
    }, [productName]);

    // Start/Stop video recording
    const toggleRecording = useCallback(async () => {
        if (isRecording) {
            // Stop recording
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            return;
        }

        // Start recording - capture the model-viewer canvas
        try {
            const viewer = viewerRef.current;
            if (!viewer) return;

            // Get the canvas from model-viewer's shadow DOM
            const canvas = viewer.shadowRoot?.querySelector('canvas') as HTMLCanvasElement;
            if (!canvas) {
                toast.error('Cannot access AR canvas for recording');
                return;
            }

            const stream = canvas.captureStream(30); // 30 FPS
            const recorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                    ? 'video/webm;codecs=vp9'
                    : 'video/webm'
            });

            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${productName.replace(/\s+/g, '-').toLowerCase()}-ar-video.webm`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                setIsRecording(false);
                setRecordingTime(0);
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
                toast.success('AR video saved!', { icon: '🎬' });
            };

            recorder.start(100); // Collect data every 100ms
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

            toast.success('Recording started...', { icon: '🔴' });
        } catch (err) {
            console.error('Video recording failed:', err);
            toast.error('Could not start video recording');
        }
    }, [isRecording, productName]);

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
                            <AnimatePresence>
                                {flash && (
                                    <motion.div
                                        className="absolute inset-0 bg-white z-40 pointer-events-none"
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Header */}
                            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent text-white">
                                <div>
                                    <h3 className="font-serif text-xl font-medium drop-shadow-md">{productName}</h3>
                                    <p className="text-xs text-white/80">
                                        {isInAR ? '📍 AR Mode Active' : 'Interactive 3D / Augmented Reality'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Recording timer indicator */}
                                    {isRecording && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 rounded-full text-xs font-mono font-bold animate-pulse">
                                            <Circle className="w-2.5 h-2.5 fill-white" />
                                            REC {formatTime(recordingTime)}
                                        </div>
                                    )}
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

                            {/* AR Capture Controls - shown during AR session */}
                            <AnimatePresence>
                                {isInAR && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center pb-8 pt-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-auto"
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 40 }}
                                    >
                                        <p className="text-white/70 text-xs mb-4 font-medium">Tap to capture your AR scene</p>
                                        <div className="flex items-center gap-8">
                                            {/* Capture Photo Button */}
                                            <button
                                                onClick={handleCapturePhoto}
                                                className="flex flex-col items-center gap-1.5 group"
                                                title="Take Photo"
                                            >
                                                <div className="w-14 h-14 rounded-full border-4 border-white bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/40 group-active:scale-90 transition-all shadow-lg">
                                                    <Camera className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="text-white text-[10px] font-medium">Photo</span>
                                            </button>

                                            {/* Record Video Button */}
                                            <button
                                                onClick={toggleRecording}
                                                className="flex flex-col items-center gap-1.5 group"
                                                title={isRecording ? 'Stop Recording' : 'Record Video'}
                                            >
                                                <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center group-active:scale-90 transition-all shadow-lg ${
                                                    isRecording
                                                        ? 'border-red-500 bg-red-600/80 animate-pulse'
                                                        : 'border-white bg-white/20 backdrop-blur group-hover:bg-white/40'
                                                }`}>
                                                    {isRecording ? (
                                                        <VideoOff className="w-6 h-6 text-white" />
                                                    ) : (
                                                        <Video className="w-6 h-6 text-white" />
                                                    )}
                                                </div>
                                                <span className="text-white text-[10px] font-medium">
                                                    {isRecording ? 'Stop' : 'Video'}
                                                </span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 3D Mode Controls (when NOT in AR) */}
                            {!isInAR && (
                                <div className="absolute bottom-6 left-6 z-10 pointer-events-none hidden md:block">
                                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm text-xs text-earth-800 font-medium">
                                        Use mouse to rotate • Scroll to zoom
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
