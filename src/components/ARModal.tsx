import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Box, Camera, Video, Square } from 'lucide-react';
import '@google/model-viewer';
import toast from 'react-hot-toast';

// Type definition for model-viewer
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
                'environment-image'?: string;
                'skybox-image'?: string;
                exposure?: string;
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const animFrameRef = useRef<number>(0);

    const [isARMode, setIsARMode] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [flash, setFlash] = useState(false);
    const [cameraError, setCameraError] = useState('');

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Composite camera + 3D model onto canvas for recording/capture
    const compositeFrame = useCallback(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const viewer = viewerRef.current;
        if (!canvas || !video || !viewer) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        // Draw camera feed
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw model-viewer canvas on top
        try {
            const mvCanvas = viewer.shadowRoot?.querySelector('canvas');
            if (mvCanvas) {
                ctx.drawImage(mvCanvas, 0, 0, canvas.width, canvas.height);
            }
        } catch (e) {
            // Cross-origin canvas read may fail silently
        }
    }, []);

    // Animation loop for continuous compositing during recording
    const startCompositeLoop = useCallback(() => {
        const loop = () => {
            compositeFrame();
            animFrameRef.current = requestAnimationFrame(loop);
        };
        loop();
    }, [compositeFrame]);

    const stopCompositeLoop = useCallback(() => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = 0;
        }
    }, []);

    // Start camera for AR mode
    const startARMode = async () => {
        try {
            setCameraError('');
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' }, // Back camera on phone
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setIsARMode(true);
            toast.success('Camera activated! Move your device to place the product.', { icon: '📷', duration: 3000 });
        } catch (err: any) {
            console.error('Camera error:', err);
            setCameraError(err.message || 'Camera access denied');
            toast.error('Could not access camera. Please allow camera permission.');
        }
    };

    // Stop camera and exit AR
    const stopARMode = useCallback(() => {
        // Stop recording if active
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }

        // Stop composite loop
        stopCompositeLoop();

        // Stop camera stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setIsARMode(false);
        setIsRecording(false);
        setRecordingTime(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [stopCompositeLoop]);

    // Capture AR photo
    const handleCapturePhoto = useCallback(() => {
        try {
            setFlash(true);
            setTimeout(() => setFlash(false), 300);

            // Composite the frame
            compositeFrame();

            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${productName.replace(/\s+/g, '-').toLowerCase()}-ar-photo.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('AR photo captured!', { icon: '📸' });
            }, 'image/png');
        } catch (err) {
            console.error('Photo capture failed:', err);
            toast.error('Could not capture photo');
        }
    }, [compositeFrame, productName]);

    // Toggle video recording
    const toggleRecording = useCallback(() => {
        if (isRecording) {
            // Stop recording
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            stopCompositeLoop();
            return;
        }

        // Start recording
        try {
            const canvas = canvasRef.current;
            if (!canvas) return;

            // Start composite loop
            startCompositeLoop();

            const stream = canvas.captureStream(30);
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

            recorder.start(100);
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

            toast.success('Recording started...', { icon: '🔴' });
        } catch (err) {
            console.error('Recording failed:', err);
            toast.error('Could not start recording');
        }
    }, [isRecording, productName, startCompositeLoop, stopCompositeLoop]);

    // Cleanup on close
    useEffect(() => {
        if (!isOpen) {
            stopARMode();
        }
        return () => {
            stopARMode();
        };
    }, [isOpen, stopARMode]);

    const handleClose = () => {
        stopARMode();
        onClose();
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
                        onClick={handleClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <div className="bg-white w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl relative overflow-hidden flex flex-col pointer-events-auto">

                            {/* Camera Flash */}
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
                            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent text-white">
                                <div>
                                    <h3 className="font-serif text-xl font-medium drop-shadow-md">{productName}</h3>
                                    <p className="text-xs text-white/80">
                                        {isARMode ? '📍 AR Camera Mode — Place product in your space' : 'Interactive 3D / Augmented Reality'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isRecording && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 rounded-full text-xs font-mono font-bold animate-pulse">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                            REC {formatTime(recordingTime)}
                                        </div>
                                    )}
                                    {isARMode && (
                                        <button
                                            onClick={stopARMode}
                                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors text-xs font-medium"
                                        >
                                            Exit AR
                                        </button>
                                    )}
                                    <button
                                        onClick={handleClose}
                                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="w-full h-full relative">

                                {/* Camera Feed (background layer in AR mode) */}
                                {isARMode && (
                                    <video
                                        ref={videoRef}
                                        className="absolute inset-0 w-full h-full object-cover z-0"
                                        autoPlay
                                        playsInline
                                        muted
                                    />
                                )}

                                {/* Hidden video element for non-AR camera init */}
                                {!isARMode && (
                                    <video ref={videoRef} className="hidden" autoPlay playsInline muted />
                                )}

                                {/* Hidden composite canvas for recording/capture */}
                                <canvas ref={canvasRef} className="hidden" />

                                {/* 3D Model Viewer */}
                                <model-viewer
                                    ref={viewerRef}
                                    src={glbAsset}
                                    alt={`3D model of ${productName}`}
                                    shadow-intensity={isARMode ? '0.5' : '1'}
                                    camera-controls
                                    auto-rotate={!isARMode}
                                    ar={false}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: isARMode ? 'absolute' : 'relative',
                                        zIndex: isARMode ? 1 : 0,
                                        backgroundColor: isARMode ? 'transparent' : undefined,
                                        // @ts-ignore
                                        '--poster-color': isARMode ? 'transparent' : undefined,
                                    }}
                                >
                                    {/* View in Your Space button - only in 3D mode */}
                                    {!isARMode && (
                                        <button
                                            slot="ar-button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                startARMode();
                                            }}
                                            className="absolute bottom-6 right-6 px-6 py-3 bg-earth-900 text-white rounded-full font-medium shadow-lg flex items-center gap-2 hover:bg-earth-800 transition-colors z-20"
                                        >
                                            <Box className="w-5 h-5" />
                                            View in Your Space
                                        </button>
                                    )}
                                </model-viewer>

                                {/* "View in Your Space" fallback button outside model-viewer */}
                                {!isARMode && (
                                    <button
                                        onClick={startARMode}
                                        className="absolute bottom-6 right-6 px-6 py-3 bg-earth-900 text-white rounded-full font-medium shadow-lg flex items-center gap-2 hover:bg-earth-800 transition-all z-20 active:scale-95"
                                    >
                                        <Camera className="w-5 h-5" />
                                        View in Your Space
                                    </button>
                                )}
                            </div>

                            {/* AR Camera Controls - Bottom Bar */}
                            <AnimatePresence>
                                {isARMode && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                        transition={{ type: 'spring', damping: 20 }}
                                    >
                                        <div className="bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-16 pb-8 px-6">
                                            <p className="text-white/60 text-[11px] text-center mb-4 font-medium">
                                                Drag the 3D model to position • Pinch to resize
                                            </p>
                                            <div className="flex items-center justify-center gap-10">
                                                {/* Capture Photo */}
                                                <button
                                                    onClick={handleCapturePhoto}
                                                    className="flex flex-col items-center gap-2 group"
                                                    title="Take Photo"
                                                >
                                                    <div className="w-16 h-16 rounded-full border-[3px] border-white bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 group-active:scale-90 transition-all shadow-xl">
                                                        <Camera className="w-7 h-7 text-white" />
                                                    </div>
                                                    <span className="text-white/90 text-[11px] font-semibold tracking-wide">PHOTO</span>
                                                </button>

                                                {/* Record Video */}
                                                <button
                                                    onClick={toggleRecording}
                                                    className="flex flex-col items-center gap-2 group"
                                                    title={isRecording ? 'Stop Recording' : 'Record Video'}
                                                >
                                                    <div className={`w-16 h-16 rounded-full border-[3px] flex items-center justify-center group-active:scale-90 transition-all shadow-xl ${
                                                        isRecording
                                                            ? 'border-red-400 bg-red-600/70 animate-pulse'
                                                            : 'border-white bg-white/10 backdrop-blur-sm group-hover:bg-white/25'
                                                    }`}>
                                                        {isRecording ? (
                                                            <Square className="w-6 h-6 text-white fill-white" />
                                                        ) : (
                                                            <Video className="w-7 h-7 text-white" />
                                                        )}
                                                    </div>
                                                    <span className="text-white/90 text-[11px] font-semibold tracking-wide">
                                                        {isRecording ? 'STOP' : 'VIDEO'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 3D Mode Instructions */}
                            {!isARMode && (
                                <div className="absolute bottom-6 left-6 z-10 pointer-events-none hidden md:block">
                                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm text-xs text-earth-800 font-medium">
                                        Use mouse to rotate • Scroll to zoom
                                    </div>
                                </div>
                            )}

                            {/* Camera Error */}
                            {cameraError && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90">
                                    <div className="text-center text-white p-6">
                                        <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <h4 className="text-lg font-medium mb-2">Camera Access Required</h4>
                                        <p className="text-white/70 text-sm mb-4">{cameraError}</p>
                                        <button
                                            onClick={() => { setCameraError(''); startARMode(); }}
                                            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                                        >
                                            Try Again
                                        </button>
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
