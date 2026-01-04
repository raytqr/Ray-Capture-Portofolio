import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Mail, ChevronRight, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) navigate('/admin', { replace: true });
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) navigate('/admin', { replace: true });
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + '/admin',
            }
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Access Link Sent to Secured Channel');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)'
                }}
            />
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-12 w-full max-w-lg shadow-2xl relative z-10 group">
                {/* Decorative Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-gold opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-gold opacity-50"></div>

                <div className="text-center mb-10">
                    <div className="mb-6 flex justify-center">
                        <img src="/logo.png" alt="RayCapture" className="h-16 w-auto object-contain invert" />
                    </div>
                    <h1 className="text-4xl font-condensed font-bold text-white tracking-widest uppercase mb-2">Admin Portal</h1>
                    <p className="text-neutral-500 font-mono text-xs tracking-widest uppercase">Restricted Access // Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-2">
                        <label className="block text-xs font-mono font-medium text-brand-gold uppercase tracking-widest ml-1">Identity Verification</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within/input:text-white transition-colors" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-neutral-900/50 border border-white/10 rounded-none py-4 pl-12 pr-4 text-white placeholder-neutral-700 font-mono focus:outline-none focus:border-brand-gold/50 focus:bg-neutral-900 transition-all duration-300"
                                placeholder="ENTER_SECURE_EMAIL"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold font-condensed tracking-widest uppercase py-4 hover:bg-brand-gold transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                    >
                        {loading ? 'Authenticating...' : (
                            <>
                                <Lock size={18} />
                                Initialize Secure Link
                                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-wider">
                        System v2.4.0 // Connection Secured via TLS
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
