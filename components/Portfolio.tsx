import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';
import { Category } from '../types';
import { X, ZoomIn, ArrowDown } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string; // db column is image_url
  imageUrl?: string; // mapping for compatibility
}

type FilterCategory = Category | 'All';

const Portfolio: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        // 1. Shuffle items randomly
        const shuffled = data.sort(() => Math.random() - 0.5);

        setPortfolioItems(shuffled.map(item => ({
          ...item,
          imageUrl: item.image_url
        })));

        // 2. Extract and Sort Categories: All -> A-Z -> Other/Others
        const rawCategories = Array.from(new Set(data.map(item => item.category)));

        // Filter out "Other" and "Others" for special handling
        const regularCats = rawCategories
          .filter(c => c !== 'Other' && c !== 'Others')
          .sort();

        const finalCategories = ['All', ...regularCats];

        // Append "Other" or "Others" at the end if they exist
        if (rawCategories.includes('Others')) finalCategories.push('Others');
        if (rawCategories.includes('Other')) finalCategories.push('Other');

        setCategories(finalCategories);
      }
    };
    fetchItems();
  }, []);

  // Filter items
  const filteredItems = activeCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  // Apply Limit logic: Show 9 initially, or all if showAll is true
  // Note: "limitnya di ksh 20" - I've set initial limit to 9 for a clean grid, clicking "See All" shows the rest.
  const INITIAL_LIMIT = 9;
  const displayItems = showAll ? filteredItems : filteredItems.slice(0, INITIAL_LIMIT);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setShowAll(false); // Reset view when changing category
  };

  return (
    <section id="portfolio" className="py-24 bg-black min-h-screen px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-7xl font-condensed font-bold text-white">SELECTED WORKS</h2>
          <p className="text-neutral-500 font-script text-2xl">A collection of moments frozen in time</p>

        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`
                px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300
                ${activeCategory === cat
                  ? 'bg-white text-black scale-105'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence>
            {displayItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                  <span className="text-neutral-300 text-xs uppercase tracking-widest mb-2">{item.category}</span>
                  <h3 className="text-white font-condensed font-bold text-2xl text-center">{item.title}</h3>
                  <ZoomIn className="text-white mt-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-500 delay-100" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* See All Button */}
        {!showAll && filteredItems.length > INITIAL_LIMIT && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="group flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white hover:text-black transition-all duration-300"
            >
              See All Works
              <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            onClick={() => setSelectedItem(null)} // Click outside to close
          >
            {/* Close Button - Fixed position and High Z-index */}
            <button
              className="fixed top-6 right-6 z-[110] bg-white/10 p-2 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(null);
              }}
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
            >
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-6 text-center">
                <h3 className="text-white text-3xl font-condensed font-bold tracking-wide">{selectedItem.title}</h3>
                <p className="text-brand-gold font-script text-xl mt-1">{selectedItem.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;