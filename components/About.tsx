import React from 'react';
import { motion } from 'framer-motion';
import { ABOUT_TEXT } from '../constants';
import { Camera, PenTool, Video } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="relative py-24 md:py-32 px-6 bg-neutral-950 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Text Side (Now on the Left/First) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 space-y-8"
          >
            <div>
              <span className="text-neutral-500 font-condensed tracking-widest uppercase text-sm mb-2 block">Who I Am</span>
              <h2 className="text-5xl md:text-7xl font-condensed font-bold text-white leading-none">
                BEYOND THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600">LENS.</span>
              </h2>
            </div>

            <div className="p-8 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/5">
              <p className="text-neutral-300 leading-relaxed text-lg font-light">
                {ABOUT_TEXT}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
               {[
                 { icon: Camera, label: 'Photography' },
                 { icon: PenTool, label: 'Design' },
                 { icon: Video, label: 'Videography' }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-neutral-300">
                   <item.icon size={16} />
                   <span className="uppercase tracking-wide">{item.label}</span>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Image Side (Now on the Right/Second) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-white/5 rounded-3xl rotate-6 blur-lg transform scale-95" />
              <img 
                src="https://picsum.photos/seed/photographer/800/1000" 
                alt="Rayhan Wahyu" 
                className="relative z-10 w-full h-full object-cover rounded-3xl grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
              />
              
              {/* Badge */}
              <div className="absolute -bottom-6 -right-6 z-20 bg-white text-black p-6 rounded-3xl shadow-xl hidden md:block">
                <p className="font-condensed font-bold text-3xl">5+</p>
                <p className="text-xs uppercase tracking-wider font-semibold">Years Experience</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
