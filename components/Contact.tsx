import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail, FolderOpen } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <footer id="contact" className="bg-black py-24 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-condensed font-bold text-5xl md:text-8xl text-white mb-6">
            LET'S CREATE<br />MAGIC TOGETHER.
          </h2>
          <p className="text-neutral-400 text-lg mb-12">
            Ready to tell your story? Book a session or just say hello.
          </p>

          <a 
            href="https://wa.me/6285159993427?text=Hello%20RayCapture,%20I%20would%20like%20to%20book%20a%20session!"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-white text-black font-bold text-lg px-10 py-4 rounded-full hover:scale-105 transition-transform duration-300"
          >
            Book via WhatsApp
          </a>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-12">
          {/* Instagram */}
          <a 
            href="https://instagram.com/_raycapture" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2"
          >
             <div className="p-3 bg-white/5 rounded-full mb-2 group-hover:bg-white/10 transition-colors">
              <Instagram className="text-white" size={20} />
             </div>
             <span className="text-neutral-400 group-hover:text-white transition-colors">@_raycapture</span>
          </a>
          
          {/* Behance */}
          <a 
            href="https://www.behance.net/gallery/241225153/Ray-Capture-Portofolio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2"
          >
             <div className="p-3 bg-white/5 rounded-full mb-2 group-hover:bg-white/10 transition-colors">
               <FolderOpen className="text-white" size={20} />
             </div>
             <span className="text-neutral-400 group-hover:text-white transition-colors">Behance Portfolio</span>
          </a>

          {/* Email */}
          <a 
            href="mailto:rayhanwahyut27@gmail.com"
            className="group flex flex-col items-center gap-2"
          >
             <div className="p-3 bg-white/5 rounded-full mb-2 group-hover:bg-white/10 transition-colors">
              <Mail className="text-white" size={20} />
             </div>
             <span className="text-neutral-400 group-hover:text-white transition-colors break-all">rayhanwahyut27@gmail.com</span>
          </a>
        </div>
        
        <div className="mt-12 text-neutral-600 text-sm font-light">
          &copy; {new Date().getFullYear()} RayCapture Photography. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Contact;