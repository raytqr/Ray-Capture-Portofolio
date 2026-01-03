import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../supabase';
import { LayoutDashboard, Image, DollarSign, User, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

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
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // Security Check: Whitelist
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (session.user.email !== adminEmail) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
                <p className="text-neutral-400 mb-6">Your email ({session.user.email}) is not authorized to access this area.</p>
                <button
                    onClick={handleLogout}
                    className="bg-neutral-800 px-6 py-2 rounded-lg hover:bg-neutral-700 transition-colors"
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
        <div className="flex min-h-screen bg-black text-white font-sans">
            <Toaster position="top-right" />

            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 border-r border-white/10 flex-shrink-0 fixed h-full">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-2xl font-condensed font-bold text-brand-gold">RayCapture<span className="text-white text-sm ml-1 font-normal opacity-50">Admin</span></h2>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-brand-gold text-black font-medium'
                                : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
