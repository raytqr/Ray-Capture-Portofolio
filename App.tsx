import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import Contact from './components/Contact';

const App: React.FC = () => {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-white/20 selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Pricing />
      <Contact />
    </main>
  );
};

export default App;
