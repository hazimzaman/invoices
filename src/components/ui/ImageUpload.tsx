import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface Props {
  currentImageUrl?: string;
  onImageUpload: (file: File) => Promise<void>;
}

export const ImageUpload: React.FC<Props> = ({ currentImageUrl, onImageUpload }) => {
  const [preview, setPreview] = useState<string>(currentImageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Handle upload
      await onImageUpload(file);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
      setPreview(currentImageUrl || '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {preview ? (
          <img 
            src={preview} 
            alt="Logo preview" 
            className="w-16 h-16 object-contain rounded-full border"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Logo'}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};