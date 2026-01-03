import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Trash2, Plus, Loader2, Save, Star, X, Edit, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

interface PricingItem {
    id: string;
    title: string;
    price_real: string;
    price_fake: string;
    description: string;
    features: string[];
    category: string;
    is_popular: boolean;
}

const PricingManager: React.FC = () => {
    const [packages, setPackages] = useState<PricingItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<PricingItem>>({
        title: '', price_real: '', price_fake: '', description: '', features: [], category: '', is_popular: false
    });
    const [featureInput, setFeatureInput] = useState('');

    // Category Selection State for Form
    const [useCustomCategory, setUseCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');

    // Category Management State (Tabs & Bulk Operations)
    const [renamingCategory, setRenamingCategory] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [activeTab, setActiveTab] = useState<string>('All');

    const fetchPackages = async () => {
        const { data, error } = await supabase
            .from('pricing_packages')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) toast.error('Failed to load packages');
        else {
            setPackages(data || []);
            // Auto-select tab if 'All' has no items or just default logic
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    // Derived list of unique categories
    const uniqueCategories = Array.from(new Set(packages.map(p => p.category))).sort();

    // Filtered list for display
    const visiblePackages = activeTab === 'All'
        ? packages
        : packages.filter(p => p.category === activeTab);

    // --- CRUD Operations ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const finalCategory = useCustomCategory ? customCategory : formData.category;
            if (!finalCategory?.trim()) {
                toast.error('Category is required');
                return;
            }

            const payload = { ...formData, category: finalCategory };

            let error;
            if (editingId) {
                const { error: updateError } = await supabase
                    .from('pricing_packages')
                    .update(payload)
                    .eq('id', editingId);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('pricing_packages')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(editingId ? 'Updated!' : 'Created!');
            resetForm();
            fetchPackages();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this package?')) return;
        const { error } = await supabase.from('pricing_packages').delete().eq('id', id);
        if (error) toast.error(error.message);
        else {
            toast.success('Deleted');
            fetchPackages();
        }
    };

    const startEdit = (pkg: PricingItem) => {
        setEditingId(pkg.id);
        setFormData(pkg);
        setUseCustomCategory(false);
        setCustomCategory('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ title: '', price_real: '', price_fake: '', description: '', features: [], category: '', is_popular: false });
        setUseCustomCategory(false);
        setCustomCategory('');
    };

    // --- Features Management ---
    const addFeature = () => {
        if (!featureInput.trim()) return;
        setFormData(prev => ({
            ...prev,
            features: [...(prev.features || []), featureInput]
        }));
        setFeatureInput('');
    };

    const removeFeature = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== idx)
        }));
    };

    // --- Category Management ---
    const handleRenameCategory = async (oldCategory: string) => {
        if (!newCategoryName.trim() || newCategoryName === oldCategory) return;
        if (!window.confirm(`Rename category "${oldCategory}" to "${newCategoryName}"? This will update all packages.`)) return;

        try {
            const { error } = await supabase
                .from('pricing_packages')
                .update({ category: newCategoryName })
                .eq('category', oldCategory);

            if (error) throw error;

            toast.success('Category renamed successfully');
            setRenamingCategory(null);
            setNewCategoryName('');
            fetchPackages();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteCategory = async (category: string) => {
        if (!window.confirm(`Are you sure you want to delete category "${category}"? ALL packages in this category will be DELETED permanently.`)) return;

        try {
            const { error } = await supabase
                .from('pricing_packages')
                .delete()
                .eq('category', category);

            if (error) throw error;

            toast.success(`Category "${category}" deleted successfully`);
            fetchPackages();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Auto-select first category if form category is empty and there are existing ones
    useEffect(() => {
        if (!editingId && !formData.category && uniqueCategories.length > 0) {
            setFormData(prev => ({ ...prev, category: uniqueCategories[0] }));
        }
    }, [uniqueCategories, editingId]);


    return (
        <div>
            <h1 className="text-3xl font-condensed font-bold mb-8">Manage Pricing</h1>

            {/* Editor Form */}
            <div className="bg-neutral-900 p-6 rounded-xl border border-white/10 mb-10 max-w-3xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    {editingId ? <Edit size={20} /> : <Plus size={20} />}
                    {editingId ? 'Edit Package' : 'Create New Package'}
                </h3>
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Basics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Title</label>
                            <input
                                className="w-full bg-black border border-neutral-700 rounded p-2 text-white"
                                placeholder="e.g. Gold Package"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Category</label>
                            <div className="flex gap-2">
                                {!useCustomCategory ? (
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="flex-1 bg-black border border-neutral-700 rounded px-4 py-2 text-white"
                                    >
                                        {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                        {uniqueCategories.length === 0 && <option value="" disabled>No categories yet</option>}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="New Category Name..."
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        className="flex-1 bg-black border border-neutral-700 rounded px-4 py-2 text-white"
                                        required
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => setUseCustomCategory(!useCustomCategory)}
                                    className="bg-neutral-800 px-3 rounded hover:bg-neutral-700 text-sm whitespace-nowrap"
                                >
                                    {useCustomCategory ? 'Select Existing' : 'New?'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Real Price</label>
                            <input
                                className="w-full bg-black border border-neutral-700 rounded p-2 text-white"
                                placeholder="e.g. Rp 5.000.000"
                                value={formData.price_real}
                                onChange={e => setFormData({ ...formData, price_real: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Fake Price (Optional)</label>
                            <input
                                className="w-full bg-black border border-neutral-700 rounded p-2 text-white"
                                placeholder="e.g. Rp 7.000.000"
                                value={formData.price_fake}
                                onChange={e => setFormData({ ...formData, price_fake: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Description</label>
                        <textarea
                            className="w-full bg-black border border-neutral-700 rounded p-2 text-white"
                            placeholder="Brief description of this package..."
                            rows={2}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Features Manager */}
                    <div>
                        <label className="text-sm text-neutral-400">Features List</label>
                        <div className="flex gap-2 mb-2 mt-1">
                            <input
                                className="flex-1 bg-black border border-neutral-700 rounded p-2 text-white"
                                placeholder="Add a feature (e.g. 'All files included')..."
                                value={featureInput}
                                onChange={e => setFeatureInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            />
                            <button type="button" onClick={addFeature} className="bg-neutral-700 px-4 rounded hover:bg-neutral-600">Add</button>
                        </div>
                        <ul className="space-y-1 max-h-40 overflow-y-auto">
                            {formData.features?.map((feat, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-black/50 p-2 rounded text-sm border border-white/5">
                                    <span>{feat}</span>
                                    <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 hover:text-white px-2">x</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Best Choice Toggle */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_popular"
                            checked={formData.is_popular}
                            onChange={e => setFormData({ ...formData, is_popular: e.target.checked })}
                            className="w-4 h-4 rounded border-neutral-700 bg-black text-brand-gold focus:ring-brand-gold"
                        />
                        <label htmlFor="is_popular" className="text-sm text-white flex items-center gap-1">
                            Check this to mark as <span className="font-bold text-brand-gold flex items-center gap-1"><Star size={12} fill="currentColor" /> Best Choice</span>
                        </label>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button type="submit" className="flex-1 bg-brand-gold text-black px-6 py-3 rounded font-bold hover:bg-yellow-500 flex justify-center items-center gap-2">
                            <Save size={18} /> {editingId ? 'Update Package' : 'Create Package'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="px-6 py-3 rounded font-bold border border-white/20 hover:bg-white/5">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Categories & Filter */}
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FolderOpen size={20} /> Manage Categories</h3>
            <div className="mb-8 overflow-x-auto pb-4">
                <div className="flex gap-3">
                    <button
                        onClick={() => setActiveTab('All')}
                        className={`px-4 py-2 rounded-lg border transition-colors ${activeTab === 'All' ? 'bg-white text-black border-white' : 'bg-neutral-900 text-neutral-400 border-white/10 hover:bg-white/5'
                            }`}
                    >
                        All Packages
                    </button>
                    {uniqueCategories.map(cat => (
                        <div key={cat} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${activeTab === cat ? 'bg-neutral-800 border-brand-gold/50' : 'bg-neutral-900 border-white/10'
                            }`}>
                            {renamingCategory === cat ? (
                                <div className="flex gap-1 items-center">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="bg-black border border-neutral-700 rounded px-2 py-1 text-sm w-32"
                                        autoFocus
                                    />
                                    <button onClick={() => handleRenameCategory(cat)} className="text-green-500 hover:text-green-400"><Save size={14} /></button>
                                    <button onClick={() => setRenamingCategory(null)} className="text-neutral-500 hover:text-white"><X size={14} /></button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={() => setActiveTab(cat)} className={`text-sm font-medium ${activeTab === cat ? 'text-white' : 'text-neutral-400'}`}>
                                        {cat}
                                    </button>
                                    <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                                    <button onClick={() => { setRenamingCategory(cat); setNewCategoryName(cat); }} className="text-neutral-500 hover:text-brand-gold" title="Rename"><Edit size={12} /></button>
                                    <button onClick={() => handleDeleteCategory(cat)} className="text-neutral-500 hover:text-red-500" title="Delete"><Trash2 size={12} /></button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visiblePackages.length === 0 && (
                    <div className="col-span-full text-center py-12 text-neutral-500 bg-neutral-900/50 rounded-xl border border-dashed border-white/10">
                        {packages.length === 0 ? 'No packages found. Create one above!' : 'No packages in this category.'}
                    </div>
                )}
                {visiblePackages.map(pkg => (
                    <div key={pkg.id} className={`bg-neutral-900 border rounded-xl p-6 relative group flex flex-col ${pkg.is_popular ? 'border-brand-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.05)]' : 'border-white/10'}`}>
                        {pkg.is_popular && (
                            <div className="absolute -top-3 left-6 bg-brand-gold text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Star size={10} fill="black" /> BEST CHOICE
                            </div>
                        )}

                        <div className="mb-4">
                            <span className="text-xs font-condensed text-neutral-500 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
                                {pkg.category}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{pkg.title}</h3>
                        <p className="text-brand-gold text-2xl font-condensed">{pkg.price_real}</p>
                        {pkg.price_fake && <p className="text-neutral-600 line-through text-sm">{pkg.price_fake}</p>}

                        <p className="text-neutral-400 text-sm mt-3 mb-4 line-clamp-2">{pkg.description}</p>

                        <ul className="text-sm text-neutral-500 space-y-1 mb-6 flex-grow">
                            {pkg.features?.slice(0, 3).map((f, i) => (
                                <li key={i}>• {f}</li>
                            ))}
                            {(pkg.features?.length || 0) > 3 && <li>... (+{(pkg.features?.length || 0) - 3} more)</li>}
                        </ul>

                        <div className="flex gap-2">
                            <button
                                onClick={() => startEdit(pkg)}
                                className="flex-1 bg-neutral-800 py-2 rounded text-white hover:bg-neutral-700 font-medium text-sm flex justify-center items-center gap-2"
                            >
                                <Edit size={14} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(pkg.id)}
                                className="bg-red-900/30 border border-red-900/50 p-2 rounded text-red-500 hover:bg-red-900/50"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingManager;
