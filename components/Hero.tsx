import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToPortfolio = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/darkmood/1920/1080" 
          alt="Background" 
          className="w-full h-full object-cover opacity-40 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <h1 className="font-condensed font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter text-white leading-none">
            CAPTURING SOULS
          </h1>
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-script text-4xl md:text-6xl text-white absolute -bottom-6 right-0 md:-right-12 lg:-right-24 rotate-[-6deg] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          >
            RayCapture
          </motion.span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-12 text-neutral-400 text-sm md:text-base tracking-[0.2em] uppercase"
        >
          Moments | Emotion | Artistry
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-16"
        >
          <button 
            onClick={scrollToPortfolio}
            className="group relative px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            Explore Portfolio
            <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
