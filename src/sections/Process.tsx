import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';

export function Process() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loading, setLoading] = useState(true);

    // Scroll progress linked to the container height
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth out the progress
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Map scroll progress (0 to 1) to frame index (0 to 191)
    const frameIndex = useTransform(smoothProgress, [0, 1], [1, 192]);

    // Preload Images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const imageCount = 192;

            const promises = Array.from({ length: imageCount }, (_, i) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    const frameNumber = (i + 1).toString().padStart(3, '0');
                    img.src = `/frames/ezgif-frame-${frameNumber}.jpg`;
                    img.onload = () => {
                        loadedImages[i] = img;
                        resolve(img);
                    };
                    img.onerror = reject;
                });
            });

            try {
                await Promise.all(promises);
                setImages(loadedImages);
                setLoading(false);
            } catch (error) {
                console.error("Failed to preload images", error);
            }
        };

        loadImages();
    }, []);

    // Render Loop
    useEffect(() => {
        if (!canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                const currentFrame = Math.floor(frameIndex.get()) - 1;
                if (images[currentFrame]) {
                    drawImageProps(ctx, images[currentFrame], 0, 0, canvas.width, canvas.height);
                }
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const unsubscribe = frameIndex.on("change", (latest) => {
            const index = Math.floor(latest) - 1;
            const img = images[index];

            if (img) {
                requestAnimationFrame(() => {
                    drawImageProps(ctx, img, 0, 0, canvas.width, canvas.height);
                });
            }
        });

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            unsubscribe();
        };
    }, [images, frameIndex]);

    return (
        <section
            id="the-process"
            ref={containerRef}
            className="relative h-[600vh] bg-black"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                {loading && (
                    <div className="text-white font-serif animate-pulse">Initializing the journey...</div>
                )}
                <canvas ref={canvasRef} className="block w-full h-full object-cover" />

                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/30 md:bg-black/20 pointer-events-none" />

                <ContentOverlay progress={smoothProgress} />

                <motion.div
                    style={{ opacity: useTransform(smoothProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 text-xs tracking-widest uppercase animate-bounce"
                >
                    Begin the Journey
                </motion.div>
            </div>
        </section>
    );
}

function drawImageProps(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, offsetX: number = 0.5, offsetY: number = 0.5) {
    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    let iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,
        nh = ih * r,
        cx, cy, cw, ch, ar = 1;

    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

function ContentOverlay({ progress }: { progress: any }) {

    // Slide 1: Hero / Introduction (0 - 0.15)
    // Slide 2: Motto / Purpose (0.25 - 0.4)
    // Slide 3: Goal 1 (0.5 - 0.65)
    // Slide 4: Goal 2/Ending (0.75 - 0.9)

    const opacity1 = useTransform(progress, [0, 0.1, 0.2], [1, 1, 0]);
    const scale1 = useTransform(progress, [0, 0.2], [1, 0.9]);

    const opacity2 = useTransform(progress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
    const y2 = useTransform(progress, [0.15, 0.45], [50, -50]);

    const opacity3 = useTransform(progress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);
    const y3 = useTransform(progress, [0.5, 0.8], [50, -50]);

    const opacity4 = useTransform(progress, [0.8, 0.9, 1], [0, 1, 1]);
    const y4 = useTransform(progress, [0.8, 1], [50, 0]);

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-center">
            {/* Slide 1: Hero */}
            <motion.div style={{ opacity: opacity1, scale: scale1 }} className="absolute max-w-4xl px-4">
                <span className="text-gold-500 tracking-[0.2em] text-sm md:text-base font-medium uppercase mb-6 block drop-shadow-md">
                    Handcrafted with Soul
                </span>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-regular leading-tight mb-8 text-white drop-shadow-lg">
                    KalaSetu
                </h1>
                <p className="max-w-2xl mx-auto text-white/90 text-lg md:text-xl font-light leading-relaxed drop-shadow-md">
                    Bridging the gap between timeless tradition and modern aesthetics.
                </p>
            </motion.div>

            {/* Slide 2: Raw Materials & Motto */}
            <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute max-w-lg px-4">
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 shadow-black drop-shadow-lg">Where Art Begins</h2>
                <p className="text-xl md:text-2xl text-white/90 drop-shadow-md font-serif italic">
                    "To touch the earth is to touch the roots of our culture."
                </p>
            </motion.div>

            {/* Slide 3: Craftsmanship */}
            <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute max-w-lg px-4">
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 shadow-black drop-shadow-lg">Hands of Heritage</h2>
                <ul className="text-left text-lg text-white/90 space-y-4 drop-shadow-md inline-block">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gold-500" /> Preserving ancient techniques</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gold-500" /> Empowering rural artisans</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gold-500" /> Creating sustainable beauty</li>
                </ul>
            </motion.div>

            {/* Slide 4: Final Product */}
            <motion.div style={{ opacity: opacity4, y: y4 }} className="absolute max-w-lg px-4">
                <h2 className="text-5xl md:text-7xl font-serif text-white mb-4 shadow-black drop-shadow-lg">A Masterpiece Born</h2>
                <p className="text-xl text-white/90 drop-shadow-md mb-8">Ready for the modern home.</p>
                {/* Visual cue to scroll further */}
            </motion.div>
        </div>
    )
}
