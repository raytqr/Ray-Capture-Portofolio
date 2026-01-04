import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../supabase';
import { LayoutDashboard, Image, DollarSign, User, LogOut, Menu, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-widest">Initializing System...</div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // Security Check
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (session.user.email !== adminEmail) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4 font-condensed uppercase tracking-widest">Access Denied</h1>
                <p className="text-neutral-400 mb-6">Your email ({session.user.email}) is not authorized to access this area.</p>
                <button
                    onClick={handleLogout}
                    className="bg-white/10 px-6 py-2 rounded-lg hover:bg-white/20 transition-colors uppercase tracking-widest text-sm"
                >
                    Sign Out
                </button>
            </div>
        );
    }

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/portfolio', icon: Image, label: 'Portfolio' },
        { path: '/admin/pricing', icon: DollarSign, label: 'Pricing' },
        { path: '/admin/about', icon: User, label: 'About Me' },
    ];

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden selection:bg-brand-gold/30 selection:text-brand-gold relative">
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: '#121212',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            }} />

            {/* Premium Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://picsum.photos/seed/darkmood/1920/1000"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20 grayscale blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80" />
            </div>

            {/* Sidebar */}
            <aside className="w-80 bg-black/40 backdrop-blur-xl border-r border-white/5 flex-shrink-0 flex flex-col h-full relative z-20 transition-all duration-300">
                {/* Header / Brand */}
                <div className="p-8 border-b border-white/5 flex flex-col">
                    <div className="mb-4">
                        <img src="/logo.png" alt="RayCapture" className="h-16 w-auto object-contain opacity-90 invert" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-[10px] font-mono text-neutral-500 tracking-[0.2em] uppercase">System Operational</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-6 space-y-2 flex-1 overflow-y-auto no-scrollbar">
                    <div className="px-4 py-2 text-[10px] font-mono text-neutral-600 uppercase tracking-widest mb-2">
                        Command Modules
                    </div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-500 relative overflow-hidden ${isActive
                                    ? 'bg-white/5 text-white border border-white/10'
                                    : 'text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <item.icon size={18} className={`transition-transform duration-500 ${isActive ? 'scale-110 text-brand-gold' : 'group-hover:scale-110'}`} />
                                <span className={`font-medium tracking-wide text-sm ${isActive ? 'text-white' : ''}`}>{item.label}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 via-transparent to-transparent pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-neutral-800 to-black border border-white/10 flex items-center justify-center">
                            <span className="font-condensed font-bold text-brand-gold">RC</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{session.user.email}</p>
                            <p className="text-xs text-neutral-500 font-mono">ADMINISTRATOR</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="group flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border border-white/5 text-neutral-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all duration-300 text-xs font-medium tracking-widest uppercase"
                    >
                        <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                        Disconnect
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-neutral-700 font-mono">v2.0 "Obsidian"</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
                <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="max-w-7xl mx-auto pb-20"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
