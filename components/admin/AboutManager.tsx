import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Loader2, Save, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

const AboutManager: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data, error } = await supabase
                .from('content')
                .select('*')
                .eq('section', 'about')
                .single();

            if (data) {
                setTitle(data.title || '');
                setBody(data.body || '');
                setImageUrl(data.image_url || '');
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let finalImageUrl = imageUrl;

            // 1. Upload new image if selected
            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `about-me-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('portfolio') // Helper: reusing portfolio bucket for simplicity
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('portfolio')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrlData.publicUrl;
            }

            // 2. Upsert content
            const { error: dbError } = await supabase
                .from('content')
                .upsert({
                    section: 'about',
                    title,
                    body,
                    image_url: finalImageUrl
                }, { onConflict: 'section' });

            if (dbError) throw dbError;

            toast.success('Profile updated successfully!');
            setSelectedFile(null); // Reset file input
        } catch (error: any) {
            toast.error('Failed to save: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-condensed font-bold mb-8">Manage About Me</h1>

            <form onSubmit={handleSave} className="space-y-8 bg-neutral-900 p-8 rounded-xl border border-white/10">

                {/* Image Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <label className="block text-sm text-neutral-400 mb-2">Profile Photo</label>
                        <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden border border-neutral-800 relative group">
                            {selectedFile ? (
                                <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                            ) : imageUrl ? (
                                <img src={imageUrl} alt="Current" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                    No Image
                                </div>
                            )}

                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                                <UploadCloud className="text-white mb-2" />
                                <span className="text-white text-xs font-bold">CHANGE PHOTO</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Headline / Name</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-black border border-neutral-700 rounded px-4 py-3 text-white focus:border-brand-gold outline-none transition-colors"
                                placeholder="e.g. Hi, I am Ray!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Bio / Description</label>
                            <textarea
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                rows={8}
                                className="w-full bg-black border border-neutral-700 rounded px-4 py-3 text-white focus:border-brand-gold outline-none transition-colors resize-none"
                                placeholder="Tell your story..."
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-brand-gold text-black px-8 py-3 rounded font-bold hover:bg-yellow-500 disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AboutManager;
