import React, { useState, useCallback, useRef } from 'react';
import type { Artwork, Profile } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { ImageIcon } from './icons/ImageIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface UploadModalProps {
  onClose: () => void;
  // FIX: The onUpload callback should not expect 'likes', as it's set in the parent component.
  onUpload: (data: Omit<Artwork, 'id' | 'timestamp' | 'likes'>) => void;
  profile: Profile;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload, profile }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState(profile.displayName || '');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFileError('Invalid file type. Please upload an image (PNG, JPG, etc.).');
        setImageFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setFileError(null);
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFileError('Invalid file type. Please upload an image (PNG, JPG, etc.).');
        setImageFile(null);
        setPreviewUrl(null);
        return;
      }
      setFileError(null);
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setFileError(null);

    const fileToBase64WithProgress = (file: File, onProgress: (progress: number) => void): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    onProgress(progress);
                }
            };

            reader.onload = () => {
                onProgress(100);
                resolve(reader.result as string);
            };
            reader.onerror = (error) => reject(error);
        });
    
    try {
        const imageUrl = await fileToBase64WithProgress(imageFile, setUploadProgress);
        onUpload({
            title,
            artist,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            imageUrl,
        });
    } catch (error) {
        console.error("Failed to process file:", error);
        setFileError("Something went wrong while processing the image. Please try again.");
        setIsUploading(false);
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Upload Your Artwork</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" disabled={isUploading}>
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
            <fieldset disabled={isUploading} className="space-y-5">
              <div>
                   <label 
                        htmlFor="file-upload" 
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver} 
                        onDrop={handleDrop} 
                        onClick={triggerFileSelect} 
                        className={`relative mt-2 flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                            isUploading ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'
                        } ${
                            isDraggingOver
                            ? 'bg-indigo-50 border-indigo-500'
                            : fileError
                            ? 'bg-red-50 border-red-500'
                            : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                        }`}
                    >
                      {previewUrl ? (
                           <img src={previewUrl} alt="Preview" className={`h-full w-full object-contain rounded-lg ${isUploading ? 'opacity-30' : ''}`} />
                      ) : (
                          <div className="text-center p-4">
                              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-600">
                                  <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                          </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-lg">
                          <SpinnerIcon className="h-12 w-12 text-indigo-600 animate-spin" />
                          <p className="mt-4 text-sm font-semibold text-gray-700">Processing image...</p>
                        </div>
                      )}
                  </label>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} accept="image/*" disabled={isUploading} />
                  {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
              </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="artist" className="block text-sm font-medium text-gray-700">Artist Name</label>
              <input
                type="text"
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. abstract, painting, colorful"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>
          </fieldset>
        </form>
         <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
           {isUploading ? (
             <div className="w-full">
                <p className="text-center text-sm font-medium text-indigo-700 mb-2">Uploading... {uploadProgress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-150"
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
            </div>
           ) : (
            <button
                type="submit"
                onClick={handleSubmit}
                disabled={!title || !imageFile || !!fileError}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                Submit Artwork
            </button>
           )}
        </div>
      </div>
    </div>
  );
};
