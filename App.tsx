import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import Contact from './components/Contact';

// Admin Components
import Login from './components/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import PortfolioManager from './components/admin/PortfolioManager';
import PricingManager from './components/admin/PricingManager';
import AboutManager from './components/admin/AboutManager';

const PublicLayout = () => {
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />} />

        {/* Admin Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="pricing" element={<PricingManager />} />
          <Route path="about" element={<AboutManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
