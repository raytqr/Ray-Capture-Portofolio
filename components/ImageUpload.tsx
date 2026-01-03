import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';

const ImageUpload: React.FC = () => {
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);
            setImageUrl(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            setImageUrl(data.publicUrl);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 bg-brand-charcoal rounded-lg border border-white/10 max-w-md mx-auto my-8">
            <h3 className="text-xl font-condensed font-bold mb-4 text-brand-gold">Upload Portfolio Image</h3>

            <div className="mb-4">
                <label
                    htmlFor="upload-btn"
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md cursor-pointer transition-all ${uploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-brand-gold text-black hover:bg-yellow-500'
                        }`}
                >
                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    <span className="font-sans font-medium">{uploading ? 'Uploading...' : 'Select Image'}</span>
                </label>
                <input
                    id="upload-btn"
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-md mb-4 text-sm">
                    <XCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {imageUrl && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-3 rounded-md text-sm">
                        <CheckCircle size={16} />
                        <span>Upload successful!</span>
                    </div>

                    <div className="rounded-md overflow-hidden border border-white/10">
                        <img src={imageUrl} alt="Uploaded" className="w-full h-48 object-cover" />
                    </div>

                    <div className="text-xs text-gray-400 break-all bg-black/50 p-2 rounded">
                        {imageUrl}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
