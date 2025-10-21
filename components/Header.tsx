import React from 'react';
import type { Profile } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { PaintBrushIcon } from './icons/PaintBrushIcon';
import { SearchIcon } from './icons/SearchIcon';
import { Avatar } from './Avatar';

interface HeaderProps {
  onUploadClick: () => void;
  onProfileClick: () => void;
  profile: Profile;
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({ onUploadClick, onProfileClick, profile, searchQuery, onSearchChange }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <PaintBrushIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight hidden sm:block">
            Art Gallery
          </h1>
        </div>

        <div className="relative flex-grow max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search by title, artist, or tag..."
            value={searchQuery}
            onChange={onSearchChange}
            className="block w-full bg-gray-100 border border-transparent rounded-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            aria-label="Search artworks"
          />
        </div>
        
        <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4">
            <button
                onClick={onProfileClick}
                className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Open profile settings"
            >
                <Avatar avatarUrl={profile.avatarUrl} className="h-9 w-9" />
                <span className="hidden sm:inline font-semibold text-sm text-gray-700 pr-1">{profile.displayName}</span>
            </button>
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
              <UploadIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Upload</span>
            </button>
        </div>
      </div>
    </header>
  );
};
