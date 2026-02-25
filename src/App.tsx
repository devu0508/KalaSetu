import { useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Process } from './sections/Process';
import { Collection } from './sections/Collection';
import { Story } from './sections/Story';
import { Footer } from './components/Footer';


function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),   
      smoothWheel: true,
    });
    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(frameId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-earth-50 text-earth-900 selection:bg-gold-200">
      <Navbar />
      <main>
        <Process />
        <Story />
        <Collection />
      </main>
      <Footer />
    </div>
  )
}

export default App
