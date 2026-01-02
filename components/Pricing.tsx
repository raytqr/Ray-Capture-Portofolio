import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING_PACKAGES } from '../constants';
import { Category } from '../types';
import { Check, Star, ArrowRight } from 'lucide-react';

// Explicitly excluded 'All' as requested
const categories: Category[] = ['Graduation', 'Wedding', 'Art Session', 'Birthday', 'Others'];

const Pricing: React.FC = () => {
  // Default to Graduation or the most popular one
  const [activeCategory, setActiveCategory] = useState<Category>('Graduation');

  const filteredPackages = PRICING_PACKAGES.filter(pkg => pkg.category === activeCategory);

  const handleSelectPlan = (packageName: string) => {
    const message = encodeURIComponent(`Hello RayCapture, I am interested in the ${packageName} package.`);
    window.open(`https://wa.me/6285159993427?text=${message}`, '_blank');
  };

  return (
    <section id="pricing" className="py-24 bg-neutral-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-7xl font-condensed font-bold text-white mb-4">INVESTMENT</h2>
          <p className="text-neutral-400">Tailored packages for every story. Malang Area.</p>
        </div>

        {/* Filter Tabs - Scrollable on mobile if needed */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 whitespace-nowrap
                ${activeCategory === cat 
                  ? 'bg-white text-black scale-105' 
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10 border border-white/5'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center"
        >
          <AnimatePresence mode="popLayout">
            {filteredPackages.map((pkg) => (
              <motion.div
                layout
                key={pkg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={`
                  relative p-8 rounded-3xl backdrop-blur-lg border transition-all duration-300 hover:transform hover:-translate-y-2 w-full flex flex-col h-full
                  ${pkg.recommended 
                    ? 'bg-gradient-to-b from-white/15 to-white/5 border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] z-20 md:scale-105' 
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                  }
                `}
              >
                {pkg.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full flex items-center gap-1 shadow-lg">
                    <Star size={12} fill="black" /> Best Choice
                  </div>
                )}

                <div className="mb-6">
                  {/* Category Tag */}
                  <div className="mb-2 text-xs font-condensed text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                    {pkg.category} <ArrowRight size={10} />
                  </div>
                  
                  <h3 className="font-condensed font-bold text-3xl text-white mb-1 leading-tight">{pkg.name}</h3>
                  <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-6">{pkg.subtitle}</p>
                  
                  {/* Price Section with Marketing Strategy */}
                  <div className="flex flex-col">
                     {pkg.originalPrice && (
                       <span className="text-neutral-500 line-through text-sm font-medium mb-1">
                         {pkg.originalPrice}
                       </span>
                     )}
                    <span className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{pkg.price}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                      <div className={`mt-1 min-w-[16px] min-h-[16px] rounded-full flex items-center justify-center ${pkg.recommended ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>
                        <Check size={10} className="stroke-[3px]" />
                      </div>
                      <span dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleSelectPlan(pkg.name)}
                  className={`
                  w-full py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all mt-auto
                  ${pkg.recommended 
                    ? 'bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10' 
                    : 'bg-transparent border border-white/20 text-white hover:bg-white/10'
                  }
                `}>
                  Choose Package
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
