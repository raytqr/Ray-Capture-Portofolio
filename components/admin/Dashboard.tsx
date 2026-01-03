import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Loader2, Image, FolderOpen } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ photos: 0, categories: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const { data, error } = await supabase
                .from('portfolio_items')
                .select('category');

            if (!error && data) {
                const uniqueCategories = new Set(data.map(item => item.category)).size;
                setStats({
                    photos: data.length,
                    categories: uniqueCategories
                });
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-condensed font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-neutral-900 p-6 rounded-xl border border-white/10 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-neutral-800 p-3 rounded-lg">
                            <Image className="text-brand-gold" size={24} />
                        </div>
                    </div>
                    <h3 className="text-neutral-400 text-sm font-medium mb-1">Total Photos</h3>
                    <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                        {loading ? <Loader2 className="animate-spin" /> : stats.photos}
                    </p>
                </div>

                <div className="bg-neutral-900 p-6 rounded-xl border border-white/10 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-neutral-800 p-3 rounded-lg">
                            <FolderOpen className="text-brand-gold" size={24} />
                        </div>
                    </div>
                    <h3 className="text-neutral-400 text-sm font-medium mb-1">Active Categories</h3>
                    <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                        {loading ? <Loader2 className="animate-spin" /> : stats.categories}
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-neutral-900/50 border border-white/5 rounded-xl p-8 text-center text-neutral-500">
                <p>Select a menu item from the sidebar to manage your content.</p>
            </div>
        </div>
    );
};

export default Dashboard;
