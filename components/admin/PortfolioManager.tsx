import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Trash2, Plus, Loader2, UploadCloud, Edit, X, Image as ImageIcon, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    image_url: string;
}

const PortfolioManager: React.FC = () => {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [titlePrefix, setTitlePrefix] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [useCustomCategory, setUseCustomCategory] = useState(false);

    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    // Category Management
    const [renamingCategory, setRenamingCategory] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Edit State
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    const [editForm, setEditForm] = useState({ title: '', category: '' });
    const [editUseCustomCategory, setEditUseCustomCategory] = useState(false);
    const [editCustomCategory, setEditCustomCategory] = useState('');

    // Derived list
    const uniqueCategories = Array.from(new Set(items.map(i => i.category))).sort();
    const availableCategories = uniqueCategories;

    const fetchItems = async () => {
        const { data, error } = await supabase
            .from('portfolio_items')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) toast.error('Failed to load items');
        else {
            setItems(data || []);
            if (data && data.length > 0 && !selectedCategory) {
                const cats = Array.from(new Set(data.map(i => i.category))).sort();
                if (cats.length > 0) setSelectedCategory(cats[0]);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files || files.length === 0) {
            toast.error('Please select images');
            return;
        }

        const finalCategory = useCustomCategory ? customCategory : selectedCategory;
        if (!finalCategory.trim()) {
            toast.error('Category is required');
            return;
        }

        setUploading(true);

        try {
            let successCount = 0;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);

                // 1. Upload to Storage
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
                if (uploadError) {
                    console.error('Upload failed', uploadError);
                    continue;
                }

                const { data: publicUrlData } = supabase.storage.from('portfolio').getPublicUrl(filePath);

                // 2. Insert into DB
                const itemTitle = files.length > 1 ? `${titlePrefix} ${i + 1}` : titlePrefix;
                const { error: dbError } = await supabase.from('portfolio_items').insert([{
                    title: itemTitle || 'Untitled',
                    category: finalCategory,
                    image_url: publicUrlData.publicUrl
                }]);

                if (!dbError) successCount++;
            }

            toast.success(`Successfully uploaded ${successCount} images!`);
            setTitlePrefix('');
            setFiles(null);
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            fetchItems();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
            setUploadProgress('');
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!window.confirm('Delete this masterpiece?')) return;
        try {
            await supabase.from('portfolio_items').delete().eq('id', id);
            const urlParts = imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            if (fileName) await supabase.storage.from('portfolio').remove([fileName]);
            toast.success('Deleted');
            fetchItems();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const startEdit = (item: PortfolioItem) => {
        setEditingItem(item);
        setEditForm({ title: item.title, category: item.category });
        const isStandard = availableCategories.includes(item.category);
        setEditUseCustomCategory(!isStandard);
        if (!isStandard) setEditCustomCategory(item.category);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        const finalCategory = editUseCustomCategory ? editCustomCategory : editForm.category;

        try {
            const { error } = await supabase.from('portfolio_items').update({
                title: editForm.title,
                category: finalCategory
            }).eq('id', editingItem.id);

            if (error) throw error;
            toast.success('Updated');
            setEditingItem(null);
            fetchItems();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleRenameCategory = async (oldCategory: string) => {
        if (!newCategoryName.trim() || newCategoryName === oldCategory) return;
        if (!window.confirm(`Rename category "${oldCategory}" to "${newCategoryName}"?`)) return;

        try {
            await supabase.from('portfolio_items').update({ category: newCategoryName }).eq('category', oldCategory);
            toast.success('Category Renamed');
            setRenamingCategory(null);
            setNewCategoryName('');
            fetchItems();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteCategory = async (category: string) => {
        if (!window.confirm(`Delete category "${category}" AND ALL ITEMS inside it?`)) return;
        try {
            const { data: itemsToDelete } = await supabase.from('portfolio_items').select('image_url').eq('category', category);
            await supabase.from('portfolio_items').delete().eq('category', category);

            if (itemsToDelete && itemsToDelete.length > 0) {
                const filesToRemove = itemsToDelete.map(i => i.image_url.split('/').pop() || '');
                await supabase.storage.from('portfolio').remove(filesToRemove);
            }
            toast.success('Category Purged');
            fetchItems();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex items-end justify-between border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-4xl font-condensed font-bold text-white tracking-tight uppercase">Asset Management</h1>
                    <p className="text-neutral-500 font-mono text-xs tracking-widest mt-2 uppercase">Portfolio Control Center</p>
                </div>
            </header>

            {/* Categories Management Strip */}
            <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-4">
                    {uniqueCategories.map(cat => (
                        <div key={cat} className="bg-neutral-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-4 min-w-[220px] group hover:border-brand-gold/30 transition-all cursor-default">
                            {renamingCategory === cat ? (
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="bg-black border border-brand-gold/50 rounded px-2 py-1 text-xs w-full text-white focus:outline-none"
                                        autoFocus
                                    />
                                    <button onClick={() => handleRenameCategory(cat)} className="text-green-500 hover:text-green-400"><Check size={14} /></button>
                                    <button onClick={() => setRenamingCategory(null)} className="text-red-500 hover:text-red-400"><X size={14} /></button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="font-condensed font-bold text-lg text-white group-hover:text-brand-gold transition-colors block">{cat}</span>
                                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{items.filter(i => i.category === cat).length} ASSETS</span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setRenamingCategory(cat); setNewCategoryName(cat); }} className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white"><Edit size={12} /></button>
                                        <button onClick={() => handleDeleteCategory(cat)} className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-red-500"><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Upload / Edit Module */}
            <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden">
                {/* Background Noise */}
                <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                {editingItem ? (
                    <div className="relative z-10">
                        <h3 className="text-xl font-condensed font-bold mb-6 flex items-center gap-2 text-brand-gold uppercase tracking-wider">
                            <Edit size={20} /> Edit Metadata
                        </h3>
                        <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">Item Title</label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">Category Assignment</label>
                                    <div className="flex gap-2">
                                        {!editUseCustomCategory ? (
                                            <select
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 focus:outline-none appearance-none"
                                            >
                                                {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={editCustomCategory}
                                                onChange={(e) => setEditCustomCategory(e.target.value)}
                                                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 focus:outline-none"
                                            />
                                        )}
                                        <button type="button" onClick={() => setEditUseCustomCategory(!editUseCustomCategory)} className="px-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-xs font-mono uppercase tracking-widest">
                                            {editUseCustomCategory ? 'Select' : 'New'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="bg-brand-gold text-black px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-yellow-500 transition-colors">Save Updates</button>
                                <button type="button" onClick={() => setEditingItem(null)} className="px-8 py-3 border border-white/10 rounded-lg text-white font-mono uppercase tracking-widest text-xs hover:bg-white/5 transition-colors">Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <h3 className="text-xl font-condensed font-bold mb-6 flex items-center gap-2 text-white uppercase tracking-wider">
                            <UploadCloud size={20} /> Secure Upload Protocol
                        </h3>
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left: Metadata */}
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <label className="block text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">Project Title (Prefix)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Wedding Series A"
                                            value={titlePrefix}
                                            onChange={(e) => setTitlePrefix(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 focus:outline-none transition-colors placeholder:text-neutral-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">Target Category</label>
                                        <div className="flex gap-2">
                                            {!useCustomCategory ? (
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 focus:outline-none appearance-none cursor-pointer"
                                                >
                                                    {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder="NEW_CATEGORY_NAME"
                                                    value={customCategory}
                                                    onChange={(e) => setCustomCategory(e.target.value)}
                                                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold/50 focus:outline-none placeholder:text-neutral-700"
                                                />
                                            )}
                                            <button type="button" onClick={() => setUseCustomCategory(!useCustomCategory)} className="px-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-xs font-mono uppercase tracking-widest">
                                                {useCustomCategory ? 'List' : 'New'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Dropzone Visual */}
                                <div className="flex-1">
                                    <label className="block text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">Source Files</label>
                                    <div className="relative group cursor-pointer">
                                        <input
                                            id="file-upload"
                                            type="file"
                                            onChange={(e) => setFiles(e.target.files)}
                                            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                                            accept="image/*"
                                            multiple
                                        />
                                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center bg-black/20 group-hover:border-brand-gold/50 group-hover:bg-brand-gold/5 transition-all duration-300 min-h-[160px]">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                                <ImageIcon className="text-neutral-400 group-hover:text-brand-gold" size={24} />
                                            </div>
                                            <p className="text-sm font-medium text-neutral-300">Drag files or click to initiate transfer</p>
                                            <p className="text-xs text-neutral-600 mt-1 font-mono uppercase tracking-wider">{files ? `${files.length} FILES QUEUED` : 'NO FILES SELECTED'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-white text-black px-6 py-4 rounded-lg font-condensed font-bold uppercase tracking-widest text-sm hover:bg-brand-gold transition-colors disabled:opacity-50 flex justify-center items-center gap-3"
                            >
                                {uploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                {uploading ? uploadProgress : 'Execute Upload Sequence'}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Masonry Grid Display */}
            <div className="columns-2 md:columns-4 lg:columns-5 gap-4 space-y-4 pb-20">
                {loading ? <div className="text-white">Loading assets...</div> : items.map((item) => (
                    <div key={item.id} className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer">
                        <img src={item.image_url} alt={item.title} className="w-full h-auto object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />

                        {/* Card Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest mb-1">{item.category}</span>
                            <h4 className="font-condensed font-bold text-white text-lg leading-none">{item.title}</h4>

                            <div className="flex gap-2 mt-3">
                                <button onClick={() => startEdit(item)} className="p-2 bg-white/10 rounded hover:bg-white text-white hover:text-black transition-colors"><Edit size={14} /></button>
                                <button onClick={() => handleDelete(item.id, item.image_url)} className="p-2 bg-red-500/10 rounded hover:bg-red-500 text-red-500 hover:text-white transition-colors border border-red-500/20"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PortfolioManager;
