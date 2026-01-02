import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  const links = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleBookNow = () => {
     const message = encodeURIComponent("Hello RayCapture, I would like to book a session!");
     window.open(`https://wa.me/6285159993427?text=${message}`, '_blank');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center p-4 transition-all duration-300 ${isScrolled ? 'pt-4' : 'pt-8'}`}>
        <div className={`
          relative flex items-center justify-between 
          px-6 py-3 
          backdrop-blur-xl bg-white/5 border border-white/10 
          rounded-full w-[90%] md:w-auto
          transition-all duration-500
        `}>
          
          {/* Logo Area */}
          <div className="flex items-center justify-between w-full md:w-auto md:mr-12">
             <a href="#hero" onClick={(e) => scrollToSection(e, '#hero')} className="flex flex-col leading-none">
              <span className="font-condensed font-bold text-xl tracking-widest text-white uppercase">RAY</span>
              <span className="font-script text-lg text-neutral-400 -mt-1">Capture</span>
            </a>
            
            <button 
              className="md:hidden text-white p-1"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-300 uppercase tracking-wider cursor-pointer"
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li>
              <button 
                onClick={handleBookNow}
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-neutral-200 transition-colors"
              >
                Book Now
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Right Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[75%] max-w-[300px] bg-black/80 backdrop-blur-2xl border-l border-white/10 z-[70] p-6 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex justify-end mb-8">
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <ul className="flex flex-col gap-6">
                {links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="text-2xl font-condensed font-bold text-neutral-300 hover:text-white hover:pl-2 transition-all block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <button 
                  onClick={() => {
                    handleBookNow();
                    setMobileOpen(false);
                  }}
                  className="w-full bg-white text-black px-6 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;