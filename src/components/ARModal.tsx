import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Video, Square } from 'lucide-react';
import '@google/model-viewer';
import toast from 'react-hot-toast';

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
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewerRef = useRef<any>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const animRef = useRef<number>(0);

    const [isARMode, setIsARMode] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [flash, setFlash] = useState(false);

    const formatTime = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    // Cleanup everything
    const cleanup = useCallback(() => {
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
        if (animRef.current) cancelAnimationFrame(animRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        animRef.current = 0;
        timerRef.current = null;
        setIsARMode(false);
        setIsRecording(false);
        setRecordTime(0);
    }, []);

    // Open camera
    const enterAR = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            streamRef.current = stream;

            // Attach stream to the always-mounted video element
            const vid = videoRef.current;
            if (vid) {
                vid.srcObject = stream;
                vid.play().catch(() => {});
            }
            setIsARMode(true);
            toast.success('Camera ready! Position the product in your space.', { icon: '📷', duration: 2500 });
        } catch (err: any) {
            toast.error('Camera access denied. Please allow camera permission and try again.');
        }
    };

    const exitAR = useCallback(() => {
        cleanup();
        if (videoRef.current) videoRef.current.srcObject = null;
    }, [cleanup]);

    // Composite camera + model onto hidden canvas
    const compositeFrame = useCallback(() => {
        const canvas = canvasRef.current;
        const vid = videoRef.current;
        if (!canvas || !vid) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = vid.videoWidth || 1280;
        const h = vid.videoHeight || 720;
        canvas.width = w;
        canvas.height = h;

        // Draw camera
        ctx.drawImage(vid, 0, 0, w, h);

        // Draw model-viewer canvas on top
        try {
            const mvCanvas = viewerRef.current?.shadowRoot?.querySelector('canvas');
            if (mvCanvas) ctx.drawImage(mvCanvas, 0, 0, w, h);
        } catch (_) {}
    }, []);

    // Capture photo
    const capturePhoto = useCallback(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 300);
        compositeFrame();
        canvasRef.current?.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${productName.replace(/\s+/g, '-')}-ar-photo.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Photo captured!', { icon: '📸' });
        }, 'image/png');
    }, [compositeFrame, productName]);

    // Toggle video recording
    const toggleRecord = useCallback(() => {
        if (isRecording) {
            recorderRef.current?.stop();
            if (animRef.current) cancelAnimationFrame(animRef.current);
            animRef.current = 0;
            return;
        }

        // Start composite loop
        const loop = () => { compositeFrame(); animRef.current = requestAnimationFrame(loop); };
        loop();

        const canvas = canvasRef.current;
        if (!canvas) return;
        const stream = canvas.captureStream(30);
        const recorder = new MediaRecorder(stream, {
            mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm',
        });
        chunksRef.current = [];
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${productName.replace(/\s+/g, '-')}-ar-video.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setIsRecording(false);
            setRecordTime(0);
            if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
            toast.success('Video saved!', { icon: '🎬' });
        };
        recorder.start(100);
        recorderRef.current = recorder;
        setIsRecording(true);
        setRecordTime(0);
        timerRef.current = setInterval(() => setRecordTime(p => p + 1), 1000);
        toast.success('Recording...', { icon: '🔴' });
    }, [isRecording, compositeFrame, productName]);

    // Cleanup on modal close
    useEffect(() => { if (!isOpen) cleanup(); return cleanup; }, [isOpen, cleanup]);

    const handleClose = () => { cleanup(); onClose(); };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className="bg-black w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl relative overflow-hidden flex flex-col pointer-events-auto">

                            {/* Flash */}
                            {flash && <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-pulse" style={{ animationDuration: '0.3s' }} />}

                            {/* Header */}
                            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-30 bg-gradient-to-b from-black/70 to-transparent text-white">
                                <div>
                                    <h3 className="font-serif text-lg font-medium drop-shadow-md">{productName}</h3>
                                    <p className="text-[11px] text-white/70">
                                        {isARMode ? '📍 AR Mode — Move device to place product' : '3D Preview — Rotate & zoom the model'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isRecording && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 bg-red-600 rounded-full text-[11px] font-mono font-bold animate-pulse">
                                            <span className="w-2 h-2 rounded-full bg-white inline-block" />
                                            {formatTime(recordTime)}
                                        </span>
                                    )}
                                    {isARMode && (
                                        <button onClick={exitAR} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium backdrop-blur transition-colors">
                                            ← Back to 3D
                                        </button>
                                    )}
                                    <button onClick={handleClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur transition-colors" aria-label="Close">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* ===== MAIN VIEW ===== */}
                            <div className="w-full h-full relative">

                                {/* Always-mounted video (hidden when not in AR) */}
                                <video
                                    ref={videoRef}
                                    autoPlay playsInline muted
                                    className={isARMode
                                        ? 'absolute inset-0 w-full h-full object-cover z-0'
                                        : 'hidden'
                                    }
                                />

                                {/* Hidden composite canvas */}
                                <canvas ref={canvasRef} className="hidden" />

                                {/* 3D Model */}
                                <div className={`w-full h-full ${isARMode ? 'absolute inset-0 z-10' : 'relative'}`}
                                     style={isARMode ? { mixBlendMode: 'normal' } : undefined}
                                >
                                    <model-viewer
                                        ref={viewerRef}
                                        src={glbAsset}
                                        alt={`3D model of ${productName}`}
                                        shadow-intensity={isARMode ? '0.3' : '1'}
                                        camera-controls
                                        auto-rotate={!isARMode}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: isARMode ? 'transparent' : '#faf8f5',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ===== BOTTOM CONTROLS ===== */}

                            {/* 3D Mode: "View in Your Space" button */}
                            {!isARMode && (
                                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/50 to-transparent flex justify-between items-end pointer-events-auto">
                                    <div className="hidden md:block">
                                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow text-xs text-earth-800 font-medium">
                                            Drag to rotate • Scroll to zoom
                                        </div>
                                    </div>
                                    <button
                                        onClick={enterAR}
                                        className="px-6 py-3 bg-earth-900 text-white rounded-full font-medium shadow-lg flex items-center gap-2 hover:bg-earth-800 active:scale-95 transition-all"
                                    >
                                        <Camera className="w-5 h-5" />
                                        View in Your Space
                                    </button>
                                </div>
                            )}

                            {/* AR Mode: Photo + Video controls */}
                            <AnimatePresence>
                                {isARMode && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto"
                                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                                    >
                                        <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-8 px-6">
                                            <p className="text-white/50 text-[11px] text-center mb-5">Drag 3D model to reposition</p>
                                            <div className="flex items-center justify-center gap-12">
                                                <button onClick={capturePhoto} className="flex flex-col items-center gap-2 group">
                                                    <div className="w-16 h-16 rounded-full border-[3px] border-white bg-white/10 flex items-center justify-center group-active:scale-90 transition-all shadow-xl backdrop-blur-sm">
                                                        <Camera className="w-7 h-7 text-white" />
                                                    </div>
                                                    <span className="text-white/80 text-[10px] font-semibold tracking-widest uppercase">Photo</span>
                                                </button>
                                                <button onClick={toggleRecord} className="flex flex-col items-center gap-2 group">
                                                    <div className={`w-16 h-16 rounded-full border-[3px] flex items-center justify-center group-active:scale-90 transition-all shadow-xl ${
                                                        isRecording ? 'border-red-400 bg-red-600/70 animate-pulse' : 'border-white bg-white/10 backdrop-blur-sm'
                                                    }`}>
                                                        {isRecording
                                                            ? <Square className="w-6 h-6 text-white fill-white" />
                                                            : <Video className="w-7 h-7 text-white" />
                                                        }
                                                    </div>
                                                    <span className="text-white/80 text-[10px] font-semibold tracking-widest uppercase">
                                                        {isRecording ? 'Stop' : 'Video'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
