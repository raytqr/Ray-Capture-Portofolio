import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/admin', { replace: true });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                navigate('/admin', { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // For simplicity, we'll implement OTP login which is easier to setup without configuring passwords
        // Or we could use password login if the user has set it up. 
        // Let's assume Email OTP (Magic Link) as it's default Supabase on.

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + '/admin',
            }
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Check your email for the login link!');
        }
        setLoading(false);
    };

    // Alternative: Password Login (if user prefers)
    // We can add a toggle or just use OTP as it's safer/easier by default.

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-condensed font-bold text-white mb-2">Admin Access</h1>
                    <p className="text-neutral-500">Enter your email to receive a magic link</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black border border-neutral-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-gold transition-colors"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-gold text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : (
                            <>
                                <Lock size={18} />
                                Send Magic Link
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
