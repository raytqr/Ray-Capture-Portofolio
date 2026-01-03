import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Trash2, Plus, Loader2, UploadCloud, Edit, X } from 'lucide-react';
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

    // Category Management State
    const [renamingCategory, setRenamingCategory] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Edit State
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    const [editForm, setEditForm] = useState({ title: '', category: '' });
    const [editUseCustomCategory, setEditUseCustomCategory] = useState(false);
    const [editCustomCategory, setEditCustomCategory] = useState('');

    // Derived list of unique categories from existing items
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
            // Auto-select first category if we have items and nothing selected
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

                const { error: uploadError } = await supabase.storage
                    .from('portfolio')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error('Upload failed for', file.name, uploadError);
                    continue; // Skip this file and try next
                }

                const { data: publicUrlData } = supabase.storage
                    .from('portfolio')
                    .getPublicUrl(filePath);

                // 2. Insert into DB
                // If bulk uploading, we append a number to the title if there are multiple files
                const itemTitle = files.length > 1 ? `${titlePrefix} ${i + 1}` : titlePrefix;

                const { error: dbError } = await supabase
                    .from('portfolio_items')
                    .insert([{
                        title: itemTitle || 'Untitled',
                        category: finalCategory,
                        image_url: publicUrlData.publicUrl
                    }]);

                if (dbError) {
                    console.error('DB insert failed for', file.name, dbError);
                } else {
                    successCount++;
                }
            }

            toast.success(`Successfully uploaded ${successCount} images!`);
            setTitlePrefix('');
            setFiles(null);
            // Reset file input (simple hack: clear form or just ignore)
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
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            // 1. Delete from DB
            const { error: dbError } = await supabase
                .from('portfolio_items')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 2. Try delete from Storage 
            // Extract filename from URL: .../portfolio/filename.jpg
            const urlParts = imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];

            if (fileName) {
                await supabase.storage.from('portfolio').remove([fileName]);
            }

            toast.success('Deleted successfully');
            fetchItems();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const startEdit = (item: PortfolioItem) => {
        setEditingItem(item);
        setEditForm({ title: item.title, category: item.category });
        // Check if current category is in the standard list, if not maybe default to custom view?
        // simple heuristic: if it's in the list, show select, else show custom input
        const isStandard = availableCategories.includes(item.category);
        setEditUseCustomCategory(!isStandard);
        if (!isStandard) setEditCustomCategory(item.category);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setEditForm({ title: '', category: '' });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        const finalCategory = editUseCustomCategory ? editCustomCategory : editForm.category;

        try {
            const { error } = await supabase
                .from('portfolio_items')
                .update({
                    title: editForm.title,
                    category: finalCategory
                })
                .eq('id', editingItem.id);

            if (error) throw error;

            toast.success('Item updated successfully');
            setEditingItem(null);
            fetchItems();
        } catch (error: any) {
            toast.error('Failed to update: ' + error.message);
        }
    };

    const handleRenameCategory = async (oldCategory: string) => {
        if (!newCategoryName.trim() || newCategoryName === oldCategory) return;
        if (!window.confirm(`Rename category "${oldCategory}" to "${newCategoryName}"? This will update all items.`)) return;

        try {
            const { error } = await supabase
                .from('portfolio_items')
                .update({ category: newCategoryName })
                .eq('category', oldCategory);

            if (error) throw error;

            toast.success('Category renamed successfully');
            setRenamingCategory(null);
            setNewCategoryName('');
            fetchItems();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteCategory = async (category: string) => {
        if (!window.confirm(`Are you sure you want to delete category "${category}"? ALL items in this category will be DELETED permanently.`)) return;

        try {
            // 1. Get all items in this category to delete their images
            const { data: itemsToDelete } = await supabase
                .from('portfolio_items')
                .select('image_url')
                .eq('category', category);

            // 2. Delete from DB
            const { error: dbError } = await supabase
                .from('portfolio_items')
                .delete()
                .eq('category', category);

            if (dbError) throw dbError;

            // 3. Delete images from storage
            if (itemsToDelete && itemsToDelete.length > 0) {
                const filesToRemove = itemsToDelete.map(i => {
                    const parts = i.image_url.split('/');
                    return parts[parts.length - 1]; // filename
                });
                await supabase.storage.from('portfolio').remove(filesToRemove);
            }

            toast.success(`Category "${category}" deleted successfully`);
            fetchItems();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-condensed font-bold mb-8">Manage Portfolio</h1>

            {/* Categories Management */}
            <div className="mb-8 overflow-x-auto pb-4">
                <div className="flex gap-4">
                    {uniqueCategories.map(cat => (
                        <div key={cat} className="bg-neutral-900 border border-white/10 rounded-lg p-3 min-w-[200px] flex flex-col gap-2">
                            {renamingCategory === cat ? (
                                <div className="flex gap-1">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="bg-black border border-neutral-700 rounded px-2 py-1 text-sm w-full"
                                        autoFocus
                                        placeholder="New Name"
                                    />
                                    <button
                                        onClick={() => handleRenameCategory(cat)}
                                        className="bg-green-600 p-1 rounded hover:bg-green-700"
                                    >
                                        <Plus size={14} className="rotate-45" /> {/* Use Check icon ideally, but Plus rotate is check-ish or just add Check icon import */}
                                    </button>
                                    <button
                                        onClick={() => setRenamingCategory(null)}
                                        className="bg-neutral-700 p-1 rounded hover:bg-neutral-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-brand-gold">{cat}</span>
                                    <span className="text-xs text-neutral-500">
                                        {items.filter(i => i.category === cat).length} items
                                    </span>
                                </div>
                            )}

                            {!renamingCategory && (
                                <div className="flex gap-2 mt-auto">
                                    <button
                                        onClick={() => {
                                            setRenamingCategory(cat);
                                            setNewCategoryName(cat);
                                        }}
                                        className="flex-1 bg-neutral-800 text-xs py-1 rounded hover:bg-neutral-700 text-center"
                                    >
                                        Rename
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(cat)}
                                        className="flex-1 bg-red-900/50 text-red-500 text-xs py-1 rounded hover:bg-red-900 text-center border border-red-900"
                                    >
                                        Delete All
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bulk Upload Form or Edit Form */}
            <div className="bg-neutral-900 p-6 rounded-xl border border-white/10 mb-8">
                {editingItem ? (
                    <>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-brand-gold">
                            <Edit size={20} /> Edit Item
                        </h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full bg-black border border-neutral-700 rounded px-4 py-2 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Category</label>
                                    <div className="flex gap-2">
                                        {!editUseCustomCategory ? (
                                            <select
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                className="flex-1 bg-black border border-neutral-700 rounded px-4 py-2 text-white"
                                            >
                                                {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                placeholder="Enter new category..."
                                                value={editCustomCategory}
                                                onChange={(e) => setEditCustomCategory(e.target.value)}
                                                className="flex-1 bg-black border border-neutral-700 rounded px-4 py-2 text-white"
                                                required
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setEditUseCustomCategory(!editUseCustomCategory)}
                                            className="bg-neutral-800 px-3 rounded hover:bg-neutral-700 text-sm"
                                        >
                                            {editUseCustomCategory ? 'Select Existing' : 'New?'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1">Change this to move item to another category.</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-brand-gold text-black px-6 py-3 rounded font-bold hover:bg-yellow-500"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-6 py-3 rounded font-bold border border-white/20 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <UploadCloud size={20} /> Bulk Upload
                        </h3>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Title Prefix (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Wedding Budi & Siti"
                                        value={titlePrefix}
                                        onChange={(e) => setTitlePrefix(e.target.value)}
                                        className="w-full bg-black border border-neutral-700 rounded px-4 py-2 text-white"
                                    />
                                    <p className="text-xs text-neutral-500 mt-1">If uploading multiple, numbers will be appended automatically.</p>
                                </div>

                                <div>
                                    <label className="block text-sm text-neutral-400 mb-1">Category</label>
                                    <div className="flex gap-2">
                                        {!useCustomCategory ? (
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="flex-1 bg-black border border-neutral-700 rounded px-4 py-2 text-white"
                                            >
                                                {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                placeholder="Enter new category..."
                                                value={customCategory}
                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                className="flex-1 bg-black border border-neutral-700 rounded px-4 py-2 text-white"
                                                required
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setUseCustomCategory(!useCustomCategory)}
                                            className="bg-neutral-800 px-3 rounded hover:bg-neutral-700 text-sm"
                                        >
                                            {useCustomCategory ? 'Select Existing' : 'New?'}
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm text-neutral-400 mb-1">Select Images</label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        onChange={(e) => setFiles(e.target.files)}
                                        className="w-full bg-black border border-neutral-700 rounded px-4 py-2 text-white"
                                        accept="image/*"
                                        multiple // Enable multiple files!
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-brand-gold text-black px-6 py-3 rounded font-bold hover:bg-yellow-500 disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        {uploadProgress || 'Uploading...'}
                                    </>
                                ) : 'Start Upload'}
                            </button>
                        </form>
                    </>
                )}
            </div>

            {/* List */}
            <h3 className="text-xl font-bold mb-4">Gallery Items ({items.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {loading ? <Loader2 className="animate-spin" /> : items.map((item) => (
                    <div key={item.id} className="bg-neutral-900 rounded-lg overflow-hidden group border border-white/5 relative aspect-square">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                            <h4 className="font-bold text-sm truncate">{item.title}</h4>
                            <span className="text-xs text-brand-gold uppercase">{item.category}</span>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => startEdit(item)}
                                className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 shadow-lg"
                                title="Edit"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id, item.image_url)}
                                className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 shadow-lg"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PortfolioManager;
