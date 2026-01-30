import { useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Process } from './sections/Process';
import { Collection } from './sections/Collection';
import { Story } from './sections/Story';
import { Footer } from './components/Footer';
import ExperimentAr from './sections/ExperimentAr';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // direction: 'vertical',
      // gestureDirection: 'vertical', 
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    }
  }, []);

  return (
    <div className="min-h-screen bg-earth-50 text-earth-900 selection:bg-gold-200">
      <Navbar />
      <main>
        <Process />
        <Story />
        <Collection />
        <ExperimentAr />
      </main>
      <Footer />
    </div>
  )
}

export default App
