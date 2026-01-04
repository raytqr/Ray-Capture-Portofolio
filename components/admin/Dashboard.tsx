import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Loader2, Image, FolderOpen, TrendingUp, Clock, Calendar } from 'lucide-react';

interface RecentItem {
    id: string;
    title: string;
    category: string;
    created_at: string;
    image_url: string;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ photos: 0, categories: 0 });
    const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            // 1. Fetch Stats
            const { data: allItems, error: statsError } = await supabase
                .from('portfolio_items')
                .select('category');

            if (!statsError && allItems) {
                const uniqueCategories = new Set(allItems.map(item => item.category)).size;
                setStats({ photos: allItems.length, categories: uniqueCategories });
            }

            // 2. Fetch Recent Activity (Last 5 Uploads)
            const { data: recent, error: recentError } = await supabase
                .from('portfolio_items')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (!recentError && recent) {
                setRecentItems(recent);
            }

            setLoading(false);
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-condensed font-bold text-white tracking-tight uppercase">Mission Control</h1>
                    <p className="text-neutral-500 font-mono text-sm tracking-widest mt-2 uppercase flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        System Operational
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 backdrop-blur-md">
                    <Clock size={20} className="text-brand-gold" />
                    <div className="text-right">
                        <div className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-1">Server Time</div>
                        <div className="text-white font-bold font-condensed tracking-wide">
                            {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photos Stat */}
                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-brand-gold/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/5 p-4 rounded-xl"><Image size={24} className="text-brand-gold" /></div>
                        <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Database_Count</span>
                    </div>
                    <div>
                        <p className="text-4xl font-condensed font-bold text-white">{loading ? <Loader2 className="animate-spin" /> : stats.photos}</p>
                        <p className="text-sm text-neutral-400 mt-2">Total Masterpieces Uploaded</p>
                    </div>
                </div>

                {/* Categories Stat */}
                <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/5 p-4 rounded-xl"><FolderOpen size={24} className="text-blue-500" /></div>
                        <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Active_Tags</span>
                    </div>
                    <div>
                        <p className="text-4xl font-condensed font-bold text-white">{loading ? <Loader2 className="animate-spin" /> : stats.categories}</p>
                        <p className="text-sm text-neutral-400 mt-2">Unique Portfolio Categories</p>
                    </div>
                </div>
            </div>

            {/* Real Recent Activity */}
            <div className="bg-neutral-900/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm min-h-[400px]">
                <h3 className="text-xl font-condensed font-bold text-white mb-8 flex items-center gap-3">
                    <TrendingUp size={24} className="text-brand-gold" />
                    Recent Upload Operations
                </h3>

                {loading ? (
                    <div className="flex items-center justify-center p-12 text-neutral-500 gap-2">
                        <Loader2 className="animate-spin" /> Fetching logs...
                    </div>
                ) : recentItems.length === 0 ? (
                    <div className="text-center p-12 text-neutral-500 font-mono uppercase tracking-widest text-sm">
                        No activity recorded
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-6 p-4 border border-white/5 bg-black/20 rounded-xl hover:bg-white/5 transition-colors group">
                                {/* Thumbnail */}
                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold truncate">{item.title || 'Untitled Asset'}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                                            {item.category}
                                        </span>
                                        <span className="text-xs text-neutral-600 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="hidden md:block text-right">
                                    <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest border border-green-500/20 px-2 py-1 rounded bg-green-500/5">
                                        Uploaded
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
